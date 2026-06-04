import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Location } from 'src/locations/entities/location.entity';

@Entity('provinces')
export class Province {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => Location, (location) => location.province)
  locations!: Location[];
}
