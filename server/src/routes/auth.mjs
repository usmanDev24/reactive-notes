import { Router } from "express";
import passport from "passport";
import UserStore from "../model/user-store.mjs";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";


const userStore = new UserStore();
export const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  async (req, res, next) => {
    res.json(req.user)
  },
);
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      profile = profile._json;
      
      const googleUserExist = await userStore.findGoogleUser(profile.sub);
      const emailExist = await userStore.findEmail(profile.email);

      if (googleUserExist) {
        done(null, googleUserExist);
      } else if (emailExist) {
        const verifiedUser = await userStore.linkGoogleAccount(
          emailExist.id,
          "Google",
          profile.sub,
          profile.picture,
        );
        done(null, verifiedUser);
      } else {
        const user = await userStore.create(
          null,
          "Google",
          profile.sub,
          null,
          profile.email,
          true,
          profile.given_name,
          profile.family_name,
          profile.picture,
        );
        done(null, user);
      }
    },
  ),
);
