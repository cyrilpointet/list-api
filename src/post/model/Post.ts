import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/model/User";
import { Team } from "../../team/model/Team";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Team, (team) => team.posts, {
    onDelete: "CASCADE",
  })
  team: Team;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;
}
