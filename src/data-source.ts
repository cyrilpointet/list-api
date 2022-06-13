import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Team } from "./entity/Team";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  username: "postgres",
  password: "postgres",
  database: "postgres",
  synchronize: true,
  logging: false,
  entities: [User, Team],
  migrations: ["src/migration/*.ts"],
  subscribers: [],
});
