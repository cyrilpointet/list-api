import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./user/model/User";
import { Team } from "./team/model/Team";
import { Post } from "./post/model/Post";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  username: "postgres",
  password: "postgres",
  database: "postgres",
  synchronize: true,
  logging: false,
  entities: [User, Team, Post],
  migrations: ["src/migration/*.ts"],
  subscribers: [],
});
