import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "../../post/model/Post";
import { Member } from "../../member/model/Member";

@Entity()
export class Team {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @OneToMany(() => Post, (post) => post.team)
  posts: Post[];

  @OneToMany(() => Member, (member) => member.team)
  members: Member[];
}
