import passport from 'passport';
import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { LimitedRole } from '../zod/common.zod';
import { googleClientConfig, } from '../../config/env';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserRepositoryImpl } from '../database/user/userRepositoryImpl';
import { CreateGoogleUser } from '../../domain/repositories/IUserRepository';


const userRepositoryImpl = new UserRepositoryImpl();

if (!googleClientConfig.googleClientId || !googleClientConfig.googleClientSecret) {
  console.warn('Google OAuth credentials not found. Google SSO will be disabled.');
} else {
  passport.use(new GoogleStrategy({
    clientID: googleClientConfig.googleClientId,
    clientSecret: googleClientConfig.googleClientSecret,
    callbackURL: googleClientConfig.googleCallbackURL,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
          const existingUser = await userRepositoryImpl.findUserByGoogleId(profile.id);
          if (existingUser) {
            return done(null, existingUser);
          }

          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error("Google account has no public email."), undefined);
          }

          const emailUser = await userRepositoryImpl.findUserByEmail(email);
          if (emailUser) {
            emailUser.googleId = profile.id;
            await userRepositoryImpl.updateUser(emailUser);
            return done(null, emailUser);
          }

          const verificationToken = uuidv4();
          const serialNumber = await userRepositoryImpl.generateNextSerialNumber();
      
            const user: CreateGoogleUser = { 
              email,
              fullName: profile.displayName,
              googleId: profile.id,
              isVerified: true,
              role: LimitedRole.User,
              verificationToken,
              serialNumber,
            };
      
            const newUser = await userRepositoryImpl.createUser<CreateGoogleUser>(user);
            if(!newUser) throw new Error("Failed to sign up, please try again");

      return done(null, newUser);
    } catch (error) {
      return done(error, undefined);
    }
  }));
}

passport.serializeUser((user: any, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userRepositoryImpl.findUserById(new Types.ObjectId(id));
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});


export default passport;