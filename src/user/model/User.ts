import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Team } from "../../team/model/Team";
import { Post } from "../../post/model/Post";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => Team, (team) => team.manager)
  teams: Team[];

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
