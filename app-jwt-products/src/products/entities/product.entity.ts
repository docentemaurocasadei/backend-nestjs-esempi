import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column('decimal', { precision: 10, scale: 2 })
    base_price!: number;

    @Column()
    category_id!: number;

    @ManyToOne(() => Category, (category) => category.products)
    category!: Category;

}
