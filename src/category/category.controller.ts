import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entity/category.entity';
import { Types } from 'mongoose';
import { UpdateNotEmptyPipe } from 'src/common/pipes/update-not-empty-input-check.pipe';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { IcategoryAndProduct } from './category.repository';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async addnewCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.createNewCategory(createCategoryDto);
  }

  @Get('/getall')
  async getAllCategory(): Promise<Category[]> {
    return this.categoryService.getAllCategory();
  }

  @Delete('/:id')
  async deleteCategory(@Param('id') id: Types.ObjectId): Promise<Category> {
    return this.categoryService.deleteCategory(id);
  }

  @Patch('/:id')
  async updateCategory(
    @Param('id') id: Types.ObjectId,
    @Body('', new UpdateNotEmptyPipe()) updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Get('/:id')
  async getOneCategory(
    @Param('id') id: Types.ObjectId,
  ): Promise<Category | IcategoryAndProduct> {
    return this.categoryService.getAllProductsByCategoryId(id);
  }
}
