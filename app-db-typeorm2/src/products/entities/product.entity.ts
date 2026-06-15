import { Category } from "src/categories/entities/category.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 255 })
    name: string

    @Column({ type: 'varchar', length: 255 })
    description: string | null

    @Column({ type: 'varchar', length: 255 })
    slug: string | null

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    base_price: number

    @Column({ type: 'varchar', length: 255 })
    sku: string

    @Column({ type: 'boolean' })
    is_active: boolean

    @ManyToMany(() => Category, (cat) => cat.products)
    @JoinTable({
        name: 'product_category',
        joinColumn: {
            name: 'product_id'
        },
        inverseJoinColumn: {
            name: 'category_id'
        }
    })
    categories: Category[]

    @OneToMany(() => ProductImage, (img) => img.product)
    images: ProductImage[]
}
