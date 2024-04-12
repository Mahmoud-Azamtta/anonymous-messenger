import mongoose from "mongoose";

const databaseConnection = () => {
  mongoose
    .connect(process.env.DB_CONNECTION_STRING)
    .then(() => {
      console.log("connected to database");
    })
    .catch((error) => {
      console.log("error while connecting to database", error);
    });
};

export default databaseConnection;
