import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ShopingCartService } from './shoping-cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entity/user.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ShoppingCart } from './entity/shoping-cart.entity';
import { Types } from 'mongoose';
import { DecreaseCountDto } from './dto/decraceCount.dto';

@Controller('cart')
export class ShopingCartController {
  constructor(private readonly shoppingCartService: ShopingCartService) {}

  @UseGuards(JwtGuard)
  @Post()
  async addProductToCart(
    @GetUser() user: User,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<ShoppingCart> {
    addToCartDto.userId = user._id;
    return this.shoppingCartService.addProductToCart(addToCartDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  async getCart(@GetUser() user : User) : Promise<ShoppingCart>{
    return this.shoppingCartService.getCart(user._id);
  }

  @UseGuards(JwtGuard)
  @Delete()
  async decreaseCartProductCount (@GetUser() user : User, @Body() decreaseCountDto : DecreaseCountDto) : Promise<ShoppingCart>{
    return this.shoppingCartService.deacreaseProductCount(user._id, decreaseCountDto)
  }
}
