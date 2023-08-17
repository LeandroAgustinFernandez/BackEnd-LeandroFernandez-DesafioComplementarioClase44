import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import UserManager from "../dao/MongoDbManagers/UserManager.js";
import { createHash, isValidPassword } from "../utils.js";
import { config } from "dotenv";

const userManager = new UserManager();
const LocalStrategy = local.Strategy;
config();

const initializePassport = () => {
  // ! PASSPORT-LOCAL STRATEGY.
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (request, username, password, done) => {
        try {
          const { first_name, last_name, email, age } = request.body;
          let user = await userManager.getUser(username);
          if (user?.email) return done(null, false);

          let newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };

          let result = await userManager.register(newUser);
          return done(null, result);
        } catch (error) {
          return done(`There is an error ${error.message}`);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          let user = await userManager.getUser(username);
          if (user?.error) done(null, false, { message: `User not found` });
          if (!isValidPassword(user, password)) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // ! PASSPORT-GITHUB
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENTID,
        clientSecret: process.env.GITHUB_CLIENTSECRET,
        callbackURL: process.env.GITHUB_CALLBACKUR,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userManager.getUser(profile._json.email);
          if (user?.error) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 18,
              email: profile._json.email,
              password: "",
            };
            let result = await userManager.register(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // ! PASSPORT USER SERIALIZE-DESERIALIZE.
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = userManager.getUser(id);
    done(null, user);
  });
};

export default initializePassport;
