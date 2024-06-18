import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './entity/category.entity';
import { CategoryRepository } from './category.repository';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports : [MongooseModule.forFeature([{name : Category.name, schema : CategorySchema}]), ProductModule],
  providers: [CategoryService, CategoryRepository],
  controllers: [CategoryController]
})
export class CategoryModule {}
