import { Router } from "express";
import passport from "passport";
import UserStore from "../model/user-store.mjs";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy } from "passport-jwt";
import { SignJWT } from "jose";
import { BrevoClient } from "@getbrevo/brevo";
import { randomInt } from "node:crypto";

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });

const userStore = new UserStore();
export const router = Router();

export function ensureAuthenticated(req, res, next) {
  passport.authenticate("jwt", (err, user, info, status) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.status(401).json({
        success: false,
        message: "",
      });
      return;
    }
    req.user = user;
    return next();
  })(req, res, next);
}

router.post("/verify-code", ensureAuthenticated, async (req, res, next) => {
  const savedCodeData = (await userStore.getCode(req.user.id))
    .verification_code;
  if (
    Number(req.body.code) === savedCodeData.code &&
    Date.now() - savedCodeData.createdAt < 1000 * 60 * 10
  ) {
    const user = await userStore.setVerified(
      req.user.id,
      req.user.unverified_email,
    );
    res.json({
      success: true,
    });
  } else {
    res.json({
      success: false,
    });
  }
});

router.post(
  "/verification-code",
  ensureAuthenticated,
  async (req, res, next) => {
    const code = randomInt(100000, 999999);
    const user = req.user;

    if (user.verified && !user.unverified_email) {
      res.json({
        success: true,
        message: "Already Verified",
      });
      return;
    }

    try {
      const mail = await brevo.transactionalEmails.sendTransacEmail({
        subject: "Verification code for " + user.unverified_email,
        htmlContent: getMailHtml(code),
        sender: {
          name: process.env.BREVO_SENDER_NAME,
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [
          {
            email: user.unverified_email,
            name: user.firstName + " " + user.lastName,
          },
        ],
      });
      await userStore.setCode(req.user.id, {
        code,
        createdAt: Date.now(),
      });
      res.json({
        success: true,
        message: "Verification Email Sent",
      });
    } catch (err) {
      next(err);
    }
  },
);
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
  softAuthenticate,
  passport.authenticate("google", {
    scope: ["email", "profile"],
  }),
);

router.get(
  "/google/callback",
  softAuthenticate,
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
      secure: process.env.PRODUCTION ? true : false,
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
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const googleProfile = profile._json;

        // 1. Check database for existing connections
        const googleUserExist = await userStore.findGoogleUser(
          googleProfile.sub,
        );
        const emailExist = await userStore.findEmail(googleProfile.email);

        // Scenario A: User has logged in with this Google account before
        if (googleUserExist) {
          return done(null, googleUserExist);
        }

        // Scenario B: Link Google to an existing session OR an existing email
        const isUnverifiedSession = req.user && !req.user.verified;

        if (emailExist || isUnverifiedSession) {
          const targetUserId = emailExist?.id || req.user?.id;

          const verifiedUser = await userStore.linkGoogleAccount(
            targetUserId,
            "Google",
            googleProfile.sub,
            googleProfile.email,
            req.user?.unverified_email,
            googleProfile.picture,
          );
          return done(null, verifiedUser);
        }

        // Scenario C: Completely new user signup via Google
        const newUser = await userStore.create(
          null,
          "Google",
          googleProfile.sub,
          null,
          googleProfile.email,
          null,
          true,
          googleProfile.given_name,
          googleProfile.family_name,
          googleProfile.picture,
        );

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
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
export async function softAuthenticate(req, res, next) {
  passport.authenticate("jwt", (err, user, info, status) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.user = null
      return next()
    }
    req.user = user;
    return next();
  })(req, res, next);
}
const getMailHtml = function (code) {
  return `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email Address</title>
    <style>
        /* Reset styles for email clients */
        body, table, td, a { text-size-adjust: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }

        /* Custom styles */
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f4f4f7;
            padding-top: 40px;
            padding-bottom: 40px;
        }
        .main-table {
            max-width: 600px;
            width: 100%;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .content-padding {
            padding: 40px;
        }
        .header {
            padding-bottom: 24px;
            border-bottom: 1px solid #edf2f7;
            text-align: left;
        }
        .brand-name {
            font-size: 20px;
            font-weight: 700;
            color: #1e293b;
            text-decoration: none;
        }
        .body-text {
            font-size: 16px;
            line-height: 24px;
            color: #51545e;
            margin-top: 24px;
            margin-bottom: 24px;
        }
        .code-container {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 16px;
            text-align: center;
            margin-top: 32px;
            margin-bottom: 32px;
        }
        .verification-code {
            font-family: 'Courier New', Courier, monospace;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 6px;
            color: #2563eb;
            margin: 0;
        }
        .footer {
            font-size: 13px;
            line-height: 18px;
            color: #94a3b8;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #edf2f7;
        }
        .footer a {
            color: #2563eb;
            text-decoration: none;
        }
    </style>
</head>
<body>

    <table role="presentation" class="wrapper">
        <tr>
            <td align="center">
                <table role="presentation" class="main-table">
                    <tr>
                        <td class="content-padding">
                            
                            <div class="header">
                                <a href="#" class="brand-name">Your email verification code</a>
                            </div>

                            <p class="body-text">Hello,</p>
                            
                            <p class="body-text">
                                Thank you for registering. To complete your account verification, please use the single-use verification code provided below.
                            </p>

                            <div class="code-container">
                                <p class="verification-code">${code}</p>
                            </div>

                            <p class="body-text">
                                This code is valid for the next 10 minutes. For security purposes, please do not share this code with anyone.
                            </p>

                            <p class="body-text">
                                If you did not request this verification, you can safely ignore this email.
                            </p>

                            <p class="body-text" style="margin-bottom: 0;">
                                Regards,<br>
                                <strong>Usman Ghani (Dev Notes)</strong>
                            </p>

                            <div class="footer">
                                <p style="margin: 0 0 8px 0;">
                                    This is an automated transactional email. Please do not reply directly to this message.
                                </p>
                                <p style="margin: 0;">
                                    Need assistance? Contact our <a href="#">Support Team</a>.
                                </p>
                            </div>

                        </td>
                    </tr>
                </table>
                </td>
        </tr>
    </table>

</body>
</html>
      `;
};
