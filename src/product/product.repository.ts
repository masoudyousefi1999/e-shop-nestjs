import { AbstractRepository } from 'src/common/database/abstract.repository';
import { Product } from './entity/product.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category } from 'src/category/entity/category.entity';

export class ProductRepository extends AbstractRepository<Product> {
  constructor(
    @InjectModel(Product.name) protected productModel: Model<Product>,
  ) {
    super(productModel);
  }

  async getProductWithCategories(id: Types.ObjectId) {
    const products = await this.productModel
      .find({ category: id })
      .populate({ path: "category", model: Category.name , select : "title"});
    if (!products) {
      return false;
    }
    return products;
  }
}
