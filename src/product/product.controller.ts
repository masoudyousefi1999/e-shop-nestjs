import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Product } from './entity/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { Types } from 'mongoose';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateNotEmptyPipe } from 'src/common/pipes/update-not-empty-input-check.pipe';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

const storage = diskStorage({
  destination: './uploads/products/images',
  filename: (req, file, cb) => {
    const name = file.originalname.split('.')[0];
    const extension = extname(file.originalname);
    const randomName = Date.now().toString();
    cb(null, `${name}-${randomName}${extension}`);
  },
});

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('image', { storage }))
  @Post()
  async addProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Product> {
    createProductDto.image = image?.path
    return this.productService.createProduct(createProductDto);
  }

  @Get('getall')
  async getAllProduct(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Get('/:id')
  async getProductById(@Param('id') id: Types.ObjectId): Promise<Product> {
    return this.productService.getProductById(id);
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Patch('/:id')
  async updateProduct(
    @Param('id') id: Types.ObjectId,
    @Body('', new UpdateNotEmptyPipe()) updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Delete('/:id')
  async deleteProduct(@Param('id') id: Types.ObjectId): Promise<Product> {
    return this.productService.deleteProduct(id);
  }
}
