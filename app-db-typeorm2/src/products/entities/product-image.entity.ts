import { Product } from "./product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('product_image')
export class ProductImage {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 255 })
    image_path: string

    @Column({ type: 'varchar', length: 255 })
    alt_text: string | null

    @Column({ type: 'int' })
    sort_order: number

    @ManyToOne(() => Product, (prod) => prod.images)
    @JoinColumn({ name: 'product_id' })
    product: Product
}
