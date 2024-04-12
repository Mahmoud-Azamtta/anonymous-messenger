import authRouter from "./modules/auth/auth.router.js";
import userRouter from "./modules/user/user.router.js";
import messageRouter from "./modules/message/message.router.js";
import databaseConnection from "../DB/connection.js";

const initApp = (app, express) => {
  databaseConnection();
  app.use(express.json());
  app.get("/", (req, res) => {
    return res.json({ message: "Hello World" });
  });
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/message", messageRouter);
  app.use("*", (req, res) => {
    return res.json({ message: "Page not found" });
  });
};

export default initApp;
