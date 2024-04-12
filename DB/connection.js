import mongoose from "mongoose";

const databaseConnection = () => {
  mongoose
    .connect(process.env.DB_CONNECTION_STRING)
    .then(() => {
      console.log("connected to database");
    })
    .catch(() => {
      console.log("error");
    });
};

export default databaseConnection;
