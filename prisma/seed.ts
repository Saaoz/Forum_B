import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Nettoyage de la base de données
    await prisma.reply.deleteMany({});
    await prisma.topicTag.deleteMany({});
    await prisma.userFavorite.deleteMany({});
    await prisma.friendship.deleteMany({});
    await prisma.topic.deleteMany({});
    await prisma.tag.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({});

    // Création des utilisateurs
    const password = await hash('password', 10);
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

    // Création d'une catégorie
    const category = await prisma.category.create({
        data: {
            name: 'General Discussion',
            description: 'A place to chat about everything',
        },
    });

    // Création des tags uniques
    const tags = await Promise.all(
        [...Array(5)].map(async (_, i) =>
            prisma.tag.create({
                data: {
                    name: `Tag${i}`,
                },
            })
        )
    );

    // Création des topics et des réponses pour chaque utilisateur
    for (const user of users) {
        const topic = await prisma.topic.create({
            data: {
                title: `Topic by ${user.username}`,
                description: `A fascinating topic by ${user.username}`,
                createdBy: user.id,
                dateCreated: new Date(),
                categoryId: category.id,
                is_pinned: false,
                is_closed: false,
                is_active: true,
            },
        });

        // Association des tags au topic
        tags.forEach(async tag => {
            await prisma.topicTag.create({
                data: {
                    topicId: topic.id,
                    tagId: tag.id,
                    createdAt: new Date(),
                },
            });
        });

        // Création d'une réponse pour le topic
        await prisma.reply.create({
            data: {
                content: `Reply to ${topic.title}`,
                createdBy: user.id,
                topicId: topic.id,
                dateCreated: new Date(),
            },
        });
    }

    // Création des favoris et des amitiés
    const firstTopic = await prisma.topic.findFirst();
    if (firstTopic) {
        users.forEach(async user => {
            await prisma.userFavorite.create({
                data: {
                    userId: user.id,
                    topicId: firstTopic.id,
                },
            });
        });

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
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
