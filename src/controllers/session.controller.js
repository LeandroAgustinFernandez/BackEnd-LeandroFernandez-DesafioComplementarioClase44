import {
  SESSION_SERVICES,
  CART_SERVICES,
} from "../services/servicesManager.js";
import { generateToken, isValidPassword, createHash } from "../utils.js";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import config from "../config/config.js";
import { Session } from "express-session";

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "leandroa.fernandez@gmail.com",
    pass: config.emailApp,
  },
});

export const login = async (request, response) => {
  let { email, password } = request.body;
  if (!email || !password)
    return response
      .status(400)
      .send({ status: "error", error: `You must complete all fields.` });
  const user = await SESSION_SERVICES.getUser(email);
  if (user?.error)
    return response
      .status(401)
      .send({ status: "error", error: `User not found` });
  if (!isValidPassword(user, password))
    return response
      .status(401)
      .send({ status: "error", error: `User or Password are wrong` });
  request.logger.info(`INFO => ${new Date()} - ${user.email} had log`);
  delete user.password;
  await SESSION_SERVICES.setLastConnection(user._id);
  const token = generateToken(user);
  response
    .cookie("tokenBE", token, { maxAge: 60 * 60 * 100, httpOnly: true })
    .send({
      status: "success",
      success: `Welcome, you will be automatically redirected shortly.`,
    });
};

export const register = async (request, response) => {
  const { first_name, last_name, email, age, password } = request.body;
  let user = await SESSION_SERVICES.getUser(email);
  if (user?.email)
    return response
      .status(400)
      .send({ error: "Email already exists. Try anorther." });

  let res = await CART_SERVICES.createCart();
  let newUser = {
    first_name,
    last_name,
    email,
    age,
    password: createHash(password),
    cart: { _id: res._id },
    role: "user",
  };
  let result = await SESSION_SERVICES.saveUser(newUser);
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
};

export const resetpassword = async (request, response) => {
  let { email, newpassword } = request.body;
  const user = await SESSION_SERVICES.getUser(email);
  if (user?.error)
    return response.status(401).send({ error: `User not found` });
  if (isValidPassword(user, newpassword))
    return response.send({
      error: `The new password must be different to the old`,
    });
  newpassword = createHash(newpassword);
  let res = await SESSION_SERVICES.changePassword({ email, newpassword });
  res?.error
    ? response.status(400).send({ error: res.error })
    : response.send({
        success: `Password modified succesfully. Please go to login.`,
      });
};

export const recoverpassword = async (request, response) => {
  let { email } = request.body;
  const user = await SESSION_SERVICES.getUser(email);
  if (user?.error)
    return response.status(401).send({ error: `User not found` });
  user.recover_password = {
    id_url: uuidv4(),
    createTime: new Date(),
  };
  await SESSION_SERVICES.recoverPassword(user);
  user.recover_password.id_url;
  let result = await transport.sendMail({
    from: "Leandro Fernandez <micorre@gmail.com>",
    to: email,
    subject: "Recuperar contraseña",
    html: `<a href="http://localhost:8080/resetpassword/${user.recover_password.id_url}">Recuperar Contrasena</a>`,
  });
  response.send({ result });
};

export const changeRole = async (request, response) => {
  const { uid } = request.params;
  let user = await SESSION_SERVICES.getUserById(uid);
  if (!user)
    response.status(404).send({ status: "error", payload: "User not found" });
  if (user.role === 'admin') return response.status(404).send({status:'error', payload:'You can´t change an Admin user role.'})
  if (user.role === "user") {
    if (user.documents) {
      let identification = user.documents.find((doc) => doc.name !== "id");
      let addressVerification = user.documents.find((doc) => doc.name !== "address");
      let accountState = user.documents.find((doc) => doc.name !== "account");
      if (!identification || !addressVerification || !accountState)
        return response.status(404).send({
          status: "error",
          payload:
            "You must upload all of the documents to become an premium user.",
        });
    } else {
      return response.status(404).send({
        status: "error",
        payload:
          "You must upload all of the documents to become an premium user.",
      });
    }

  }
  let result = await SESSION_SERVICES.changeRole(uid)
  response.send({ result });
};

export const current = async (request, response) => {
  const { user } = request.user;
  response.send({ user });
};

export const uploadDocuments = async (request, response) => {
  const { uid } = request.params;
  const { files } = request;
  try {
    let documents = [];
    files.forEach((file) => {
      documents.push({ name: file.fieldname, reference: file.filename });
    });
    let result = await SESSION_SERVICES.uploadDocuments(uid, documents);
    response.send({status: 'success',payload: result});
  } catch (error) {
    response.status(500).send({status: 'error', payload:"There was an error uploading the documents"});
  }
};
