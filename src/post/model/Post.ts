import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../user/model/User";
import { Team } from "../../team/model/Team";

@Entity()
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  content: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @ManyToOne(() => Team, (team) => team.posts, {
    onDelete: "CASCADE",
  })
  team: Team;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: "CASCADE",
  })
  author: User;
}
