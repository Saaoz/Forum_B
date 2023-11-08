// prisma/seed.js
// commande : npx prisma db seed

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

//clean database
async function cleanDatabase() {
    await prisma.reply.deleteMany({});
    await prisma.topicTag.deleteMany({});
    await prisma.userFavorite.deleteMany({});
    await prisma.friendship.deleteMany({});
    await prisma.topic.deleteMany({});
    await prisma.tag.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({});
}


async function main() {
    await cleanDatabase();
    // Users
    const password = await hash('password', 10); // Hachage d'un mot de passe pour tous les utilisateurs
    const users = await Promise.all(
        [...Array(5)].map(async (_, i) =>
            prisma.user.create({
                data: {
                    username: `user${i + 1}`,
                    password: password,
                    email: `user${i + 1}@example.com`,
                    date_registered: new Date(),
                    is_admin: false,
                    is_banned: false,
                    is_active: true,
                },
            })
        )
    );

    // Categories
    const categories = await prisma.category.create({
        data: {
            name: 'General Discussion',
            description: 'A place to chat about everything',
        },
    });

    // Topics and Replies
    for (const user of users) {
        // Create a new topic for each user
        const topic = await prisma.topic.create({
            data: {
                title: `Topic by ${user.username}`,
                description: `A fascinating topic by ${user.username}`,
                createdBy: user.id,
                dateCreated: new Date(),
                categoryId: categories.id,
                isPinned: false,
                isClosed: false,
                // tags here, we will do it in the next step
            },
        });

        // Create a new tag and associate it with the topic via the TopicTag table
        const tags = await Promise.all(
            [...Array(5)].map(async (_, i) =>
                prisma.tag.create({
                    data: {
                        name: `tag${i + 1}`,
                    },
                })
            )
        );

        for (const tag of tags) {
            await prisma.topicTag.create({
                data: {
                    topicId: topic.id,
                    tagId: tag.id,
                    createdAt: new Date()
                }
            })
        }

        // Create a reply for the created topic
        await prisma.reply.create({
            data: {
                content: `Reply to ${topic.title}`,
                createdBy: user.id,
                topicId: topic.id,
                dateCreated: new Date(),
            },
        });
    }

    // UserFavorites
    // Assume every user favorites the first topic
    const firstTopic = await prisma.topic.findFirst();
    if (firstTopic) {
        for (const user of users) {
            await prisma.userFavorite.create({
                data: {
                    userId: user.id,
                    topicId: firstTopic.id,
                },
            });
        }
    }

    // Friendships
    // Establishing a friendship relation between each pair of users
    for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
            await prisma.friendship.create({
                data: {
                    userId1: users[i].id,
                    userId2: users[j].id,
                    status: 'FRIENDS',
                },
            });
        }
    }

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });