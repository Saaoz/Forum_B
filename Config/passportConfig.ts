// config/passportConfig.ts
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email: string, password: string, done: (error: any, user?: any, options?: { message: string}) => void) => {
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
        return done(null, false, { message: 'No user with that email' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
        return done(null, user);
    } else {
        return done(null, false, { message: 'Password incorrect' });
    }
}));

export default passport;
