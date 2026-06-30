import { Router } from "express";
import passport from "passport";
import UserStore from "../model/user-store.mjs";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy } from "passport-jwt";
import { SignJWT } from "jose";
const userStore = new UserStore();
export const router = Router();

export function ensureAuthenticated(req, res, next) {
  passport.authenticate("jwt", { session: false })(req, res, next);
}

router.post("/logout", ensureAuthenticated, async (req, res, next) => {
  res.clearCookie(process.env.SESSION_COOKIE_NAME);
  res.json({
    success: true,
    message: "user logout complete",
  });
});

router.post("/register", async (req, res, next) => {
  const data = req.body;
  const user = await userStore.create(
    data.userName,
    "Local",
    null,
    data.password,
    null,
    data.unverified_email,
    false,
    data.firstName,
    data.lastName,
    null,
  );
  res.json({
    success: true,
    message: "new user account created",
  });
});

router.post("/login", async (req, res, next) => {

  const verified = await userStore.verifyPassword(
    req.body.email,
    req.body.userName,
    req.body.password,
  );

  if (!verified) {
    res.json({
      success: false,
      message: "wrong credentials...",
    });
    return;
  }
  const user = await userStore.read(null, req.body.userName);
  const secret = new TextEncoder().encode(process.env.SESSION_COOKIE_SECRET);
  const alg = "HS256";

  const sessJWT = await new SignJWT({ sub: user.id })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setAudience(process.env.SESSION_COOKIE_AUD)
    .setIssuer(process.env.SESSION_COOKIE_ISS)
    .setExpirationTime("10 days")
    .sign(secret);

  res.cookie(process.env.SESSION_COOKIE_NAME, sessJWT, {
    maxAge: 1000 * 60 * 60 * 24 * 10,
    secure: false,
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  });
  res.redirect("/api/v1/users/me");
});

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
    const secret = new TextEncoder().encode(process.env.SESSION_COOKIE_SECRET);
    const alg = "HS256";

    const sessJWT = await new SignJWT({ sub: req.user.id })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setAudience(process.env.SESSION_COOKIE_AUD)
      .setIssuer(process.env.SESSION_COOKIE_ISS)
      .setExpirationTime("10 days")
      .sign(secret);

    res.cookie(process.env.SESSION_COOKIE_NAME, sessJWT, {
      maxAge: 1000 * 60 * 60 * 24 * 10,
      secure: true,
      sameSite: "lax",
      path: "/",
      httpOnly: true,
    });
    res.redirect("/api/v1/users/me");
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
          null,
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

passport.use(
  new JwtStrategy(
    {
      algorithms: "HS256",
      secretOrKey: new TextEncoder().encode(process.env.SESSION_COOKIE_SECRET),
      issuer: process.env.SESSION_COOKIE_ISS,
      audience: process.env.SESSION_COOKIE_AUD,
      jwtFromRequest: (req) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies[process.env.SESSION_COOKIE_NAME];
        }
        return token;
      },
    },
    async (payload, done) => {
      const user = await userStore.read(payload.sub);
      if (user) {
        done(null, user);
      } else {
        done(new Error("session rejected"));
      }
    },
  ),
);
