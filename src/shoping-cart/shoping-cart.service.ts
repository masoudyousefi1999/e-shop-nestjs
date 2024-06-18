import { Injectable } from '@nestjs/common';
import { ShoppingCartRepository } from './shopping-cart.repository';
import { ShoppingCart } from './entity/shoping-cart.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Types } from 'mongoose';
import { DecreaseCountDto } from './dto/decraceCount.dto';

@Injectable()
export class ShopingCartService {
  constructor(
    private readonly shoppingCartRepository: ShoppingCartRepository,
  ) {}

  async addProductToCart(addToCartDto: AddToCartDto): Promise<ShoppingCart> {
    return this.shoppingCartRepository.createOrUpdateShoppingCart(addToCartDto);
  }

  async getCart(id: Types.ObjectId): Promise<ShoppingCart> {
    return this.shoppingCartRepository.getUserActiveCart(id);
  }

  async deacreaseProductCount(
    id: Types.ObjectId,
    decreaseCountDto : DecreaseCountDto,
  ): Promise<ShoppingCart> {
    return this.shoppingCartRepository.deacreaseProductCount(id, decreaseCountDto);
  }
}
