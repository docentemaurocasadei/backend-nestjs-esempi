import { Province } from 'src/provinces/entities/province.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  province_id!: number;

  @ManyToOne(() => Province, (province) => province.locations)
  @JoinColumn({ name: 'province_id' })
  province!: Province;
}
