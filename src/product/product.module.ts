import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './entity/product.entity';
import { ProductRepository } from './product.repository';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MulterModule.register()
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports : [ProductRepository]
})
export class ProductModule {}
