import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./config/datasource";
import routes from "./routes";

export const createApp = async () => {
  await AppDataSource.initialize();
  const app = express();
  app.use(express.json());
  app.use("/api", routes);
  return app;
};
