import userModel from "../../../DB/models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../../utils/emailSender.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    return res.status(409).json({ message: "Email already in use" });
  }
  const hash = await bcrypt.hash(password, Number(process.env.SALTROUND));
  const newUser = await userModel.create({ username, email, password: hash });
  if (!newUser) {
    return res.status(500).json({ message: "Error while creating new user" });
  }

  const token = jwt.sign(
    { id: newUser._id },
    process.env.CONFIRM_EMAIL_SIGNATURE,
  );

  await sendConfirmEmail(email, token);

  return res.status(201).json({
    message: "success",
    user: { username: newUser.username, email: newUser.email },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel
    .findOne({ email })
    .select("username password confirmedEmail");
  if (!user) {
    return res
      .status(409)
      .json({ message: "This email is not connected to an account" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(406).json({ message: "Incorrect password" });
  }

  console.log(user);
  if (!user.confirmedEmail) {
    console.log(user.confirmedEmail);
    return res.json({ message: "User must confirm his/her email address" });
  }

  // ({ Payload or the data the user will get when he decode the token }, signature, {expire time})
  // Note: when giving token expire time I will need to refresh the token (not covered yet)
  const token = jwt.sign({ id: user._id }, process.env.LOGIN_SIGNATURE, {
    expiresIn: "1h",
  });
  return res.status(201).json({ message: "success", token });
};

export const confirmEmail = async (req, res) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.CONFIRM_EMAIL_SIGNATURE);

  if (!decoded.id) {
    return res.status(400).json({ message: "Invalid token" });
  }

  try {
    const user = await userModel.findByIdAndUpdate(decoded.id, {
      confirmedEmail: true,
    });
    if (!user) return res.status(400).json({ message: "Invalid token" });
    if (user.confirmedEmail) {
      return res.status(409).json({ message: "Email is already confirmed" });
    }
    return res.status(200).json({ message: "Email confirmed successfuly" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const sendConfirmEmail = async (to, token) => {
  console.log(token);
  const subject = "Confirm your email";
  const body = `
    <main>
      <p>Tap the button below to confirm your email address. If you didn't create an account with ${to}, you can safely delete this email.</p>
      <div style="display: flex; justify-content: center; align-items: center; margin-top: 1rem">
        <a href="${process.env.HOST}/auth/confirm-email/${token}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; background-color: #1257ff text-decoration: none; border-radius: 6px;">Click here to confirm your email</a>
      </div>
    </main>
  `;
  await sendEmail(to, subject, body)
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.log("error", error);
      return false;
    });
};
