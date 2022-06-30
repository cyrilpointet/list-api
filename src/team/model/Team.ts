import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "../../post/model/Post";
import { Member } from "../../member/model/Member";

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Post, (post) => post.team)
  posts: Post[];

  @OneToMany(() => Member, (member) => member.team)
  members: Member[];
}
