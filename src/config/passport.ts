import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'; 
import { IUser, User } from "../models/User";

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, undefined);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:5000/auth/google/callback",
      accessType: "offline",  
      prompt: 'consent',
      scope: ["profile", "email", "https://www.googleapis.com/auth/drive.file"],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: (err: any, user?: IUser) => void
    ) => {
      try {
        console.log(refreshToken,"refreshToken");
        console.log(accessToken,"accessToken");
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          user.refreshToken = refreshToken;
          await user.save();
          return done(null, user);
        }
        user = new User({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          photo: profile.photos?.[0].value,
          refreshToken,
        });
        await user.save();
        done(null, user);
      } catch (err) {
        done(err, undefined);
      }
    }
  )
);

export default passport;
