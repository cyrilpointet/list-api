import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./user/model/User";
import { Team } from "./team/model/Team";
import { Post } from "./post/model/Post";
import { Member } from "./member/model/Member";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: true,
  logging: false,
  entities: [User, Team, Post, Member],
  migrations: ["src/migration/*.ts"],
  subscribers: [],
});
