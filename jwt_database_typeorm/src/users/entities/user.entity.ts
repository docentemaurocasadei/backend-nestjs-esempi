import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from '../../auth/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100, unique: true })
  username!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role!: Role;

  @Column({ default: true })
  active!: boolean;
}