import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../user/model/User";
import { Post } from "../../post/model/Post";

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.teams)
  manager: User;

  @OneToMany(() => Post, (post) => post.team)
  posts: Post[];
}
