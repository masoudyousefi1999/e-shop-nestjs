import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { Category } from './entity/category.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductRepository } from 'src/product/product.repository';
import { Product } from 'src/product/entity/product.entity';

export interface IcategoryAndProduct {
  category: Category;
  products: Product[];
}

@Injectable()
export class CategoryRepository extends AbstractRepository<Category> {
  constructor(
    @InjectModel(Category.name) protected CategoryModel: Model<Category>,
    private readonly productRepository: ProductRepository,
  ) {
    super(CategoryModel);
  }

  async getAllProductsByCategoryId(
    _id: Types.ObjectId,
  ): Promise<Category | IcategoryAndProduct> {
    try {
      const category: Category = await this.CategoryModel.findById(_id);
      if (!category) {
        throw new NotFoundException(`category with id : ${_id} not found.`);
      }
      const products =
        await this.productRepository.getProductWithCategories(_id);
      if (!products) {
        return category;
      }
      return {
        category,
        products,
      };
    } catch (error) {
      throw new InternalServerErrorException(`database error : ${error}`);
    }
  }
}
