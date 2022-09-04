import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne} from "typeorm";
import {User} from "./User";

@Entity()
export class Order {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  Processor: string;

  @Column()
  RAM: string;

  @Column()
  Motherboard: string;

  @Column()
  Cabinet: string;

  @Column()
  Storage: string;

  @Column()
  Graphics: string;

  @Column({default: 'Added to Cart'})
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.orders)
  user: User;
}
