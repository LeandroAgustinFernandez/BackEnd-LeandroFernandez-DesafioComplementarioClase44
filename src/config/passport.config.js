import passport from "passport";
import jwt from "passport-jwt";
import config from "./config.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = (request) =>
  request && request.cookies ? request.cookies["tokenBE"] : null;

const initializePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.jwtPrivate,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default initializePassport;
