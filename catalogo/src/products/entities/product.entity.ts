import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../../categories/entities/category.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ nullable: true })
    description?: string;

    @Column('decimal')
    price!: number;

    @ManyToOne(() => Category, category => category.products, { onDelete: 'NO ACTION' })
    category!: Category;
}
