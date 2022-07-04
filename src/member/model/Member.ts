import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Team } from "../../team/model/Team";
import { User } from "../../user/model/User";

@Entity()
export class Member {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  manager: boolean;

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
  user: User;
}
