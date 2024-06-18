import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductRepository } from './product.repository';
import { Product } from './entity/product.entity';
import { Types } from 'mongoose';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    return this.productRepository.createDocument(createProductDto);
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAllDocuments();
  }

  async getProductById(id: Types.ObjectId): Promise<Product> {
    return this.productRepository.findOneDocument(id);
  }

  async updateProduct(
    id: Types.ObjectId,
    updateProduct: UpdateProductDto,
  ): Promise<Product> {
    return this.productRepository.updateDocument(id, updateProduct);
  }

  async deleteProduct(id: Types.ObjectId): Promise<Product> {
    return this.productRepository.deleteDocument(id);
  }
}
