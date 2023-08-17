import { Router } from "express";
import UserManager from "../dao/MongoDbManagers/UserManager.js";
import { generateToken, isValidPassword, createHash } from "../utils.js";
import CartManager from "../dao/MongoDbManagers/CartManager.js";

const router = new Router();
const userManager = new UserManager();
const cartManager = new CartManager();

router.post("/login", async (request, response) => {
  let { email, password } = request.body;
  if (!email || !password)
    return response
      .status(400)
      .send({ status: "error", error: `You must complete all fields.` });
  const user = await userManager.getUser(email);
  if (user?.error)
    return response.status(401).send({ error: `User not found` });
  if (!isValidPassword(user, password))
    return response.status(401).send({ error: `User or Password are wrong` });
  delete user.password;
  const token = generateToken(user);
  response
    .cookie("tokenBE", token, { maxAge: 60 * 60 * 100, httpOnly: true })
    .send({
      success: `Welcome, you will be automatically redirected shortly.`,
    });
});

router.post("/register", async (request, response) => {
  const { first_name, last_name, email, age, password } = request.body;
  let user = await userManager.getUser(email);
  if (user?.email)
    return response
      .status(400)
      .send({ error: "Email already exists. Try anorther." });

  let res = await cartManager.addCart();
  let newUser = {
    first_name,
    last_name,
    email,
    age,
    password: createHash(password),
    cart: res._id,
    role: "user",
  };

  let result = await userManager.register(newUser);

  let { password: pass, ...userAttributes } = newUser;

  const token = generateToken(userAttributes);
  response
    .cookie("tokenBE", token, {
      maxAge: 60 * 60 * 100,
      httpOnly: true,
    })
    .send({
      success: `Registered correctly. Please go to login.`,
      payload: result,
    });
});

router.post("/resetpassword", async (request, response) => {
  let res = await userManager.resetPassword(request.body);
  res?.error
    ? response.status(400).send({ error: res.error })
    : response.send({
        success: `Password modified succesfully. Please go to login.`,
      });
});

// ! LOGIN CON PASSPORT-GITHUB STRATEGY
// router.get(
//   "/github",
//   passport.authenticate("github", { scope: ["user:email"] }),
//   async (request, response) => {}
// );

// router.get(
//   "/githubcallback",
//   passport.authenticate("github", { failureRedirect: "/login" }),
//   async (request, response) => {
//     request.session.user = {
//       name: request.user.first_name,
//       email: request.user.email,
//       rol: "usuario",
//     };
//     response.redirect("/products");
//   }
// );

export default router;
