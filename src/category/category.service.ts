import { Injectable } from '@nestjs/common';
import { CategoryRepository, IcategoryAndProduct } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entity/category.entity';
import { Types } from 'mongoose';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Product } from 'src/product/entity/product.entity';

@Injectable()
export class CategoryService {
    constructor(private readonly categoryRepository : CategoryRepository){}


    async createNewCategory(createCategoryDto : CreateCategoryDto) : Promise<Category>{
        return this.categoryRepository.createDocument(createCategoryDto)
    }

    async getAllCategory() : Promise<Category[]>{
        return this.categoryRepository.findAllDocuments();
    }

    async deleteCategory(id : Types.ObjectId) : Promise<Category>{
        return this.categoryRepository.deleteDocument(id);
    }

    async updateCategory(id : Types.ObjectId, updateCategoryDto : UpdateCategoryDto) : Promise<Category>{
        return this.categoryRepository.updateDocument(id,updateCategoryDto);
    }

    async getOneCategory(id:Types.ObjectId) : Promise<Category>{ 
        return this.categoryRepository.findOneDocument(id);
    }

    async getAllProductsByCategoryId(id : Types.ObjectId) : Promise<Category | IcategoryAndProduct> {
        return this.categoryRepository.getAllProductsByCategoryId(id)
    }
}
