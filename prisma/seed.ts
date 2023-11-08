// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Supprimez toutes les données existantes
    await prisma.user.deleteMany({});

    // Ajoutez vos utilisateurs initiaux
    await prisma.user.create({
        data: { /* ... données de l'utilisateur ... */ },
    });

    // ... répétez pour d'autres données ...
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
