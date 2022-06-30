import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Team } from "../../team/model/Team";
import { User } from "../../user/model/User";

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  manager: boolean;

  @ManyToOne(() => Team, (team) => team.posts, {
    onDelete: "CASCADE",
  })
  team: Team;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: "CASCADE",
  })
  user: User;
}
