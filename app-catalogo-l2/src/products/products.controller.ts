import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Redirect, Res, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-products.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateProductDto } from './dto/update-products.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
interface Product {
    id: number;
    name: string;
    price: number;
}

@ApiTags('products')
@UseGuards(AuthGuard)
@Controller('products') //localhost:3000/products
export class ProductsController {
    private products: Product[] = [
        { id: 1, name: 'Prodotto 1', price: 10 },
        { id: 2, name: 'Prodotto 2', price: 20 },
        { id: 3, name: 'Prodotto 3', price: 30 },
    ];

    @ApiOperation({summary:'inserimento prodotto'})
    @Get()
    getProducts(): Product[] {
        return this.products;
    }
    // getProducts(@Res() res): void {
    //     const lp = this.products;
    //     res.setHeader('y-mio-token', 'ciao');
    //     res.status(200).json({
    //         message: 'Lista dei prodotti',
    //         products: lp,
    //         total: lp.length
    //     });
    // }

    @Get('search') 
    searchProducts(@Query('q') query: string): Product[] {
        return this.products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
    }

    @Get('5')
    @Redirect('/products/1', 301)
    redirectProduct5() {
    return;
    }

    @ApiOperation({summary: 'lettura prodotto'})
    @ApiBody()
    @Get(':id') //localhost:3000/products/123       
    getProductById(@Param('id') id: string): Product | undefined {
        const product = this.products.find(product => product.id === parseInt(id));
        if (!product) {
            throw new NotFoundException('Prodotto non trovato');
        }
        return product;
    }


    @Post()
    createProduct(@Body() data: CreateProductDto): Product {
        this.products.push({
            id: this.products.length + 1,
            name: data.name,
            price: data.price || 0
        });
        const newProduct = this.products[this.products.length - 1];
        return newProduct;
    }

    @Put(':id')
    updateProduct(@Param('id') id: string, @Body() data: UpdateProductDto): Product | undefined {
        const productIndex = this.products.findIndex(product => product.id === parseInt(id));
        if (productIndex !== -1) {
            this.products[productIndex] = { ...this.products[productIndex], ...data };
            return this.products[productIndex];
        }
        return undefined;
    }

    @Delete(':id')
    deleteProduct(@Param('id') id: string): boolean | Product   {
        const productIndex = this.products.findIndex(product => product.id === parseInt(id));
        if (productIndex !== -1) {
            const deletedProduct = this.products[productIndex];
            this.products.splice(productIndex, 1);
            return deletedProduct;
        }
        return false;
    }


}
