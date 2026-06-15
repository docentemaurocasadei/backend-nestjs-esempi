import { Product } from "src/products/entities/product.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 255 })
    name: string
    @Column({ type: 'varchar', length: 255 })
    description: string | null
    @Column({ type: 'varchar', length: 255 })
    slug: string | null


    @ManyToMany(() => Product, (prod) => prod.categories)
    @JoinTable({
        name: 'product_category',
        joinColumn: {
            name: 'category_id'
        },
        inverseJoinColumn: {
            name: 'product_id'
        }
    })
    products: Product[]

}
