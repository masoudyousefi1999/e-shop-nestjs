import { Module } from '@nestjs/common';
import { ShopingCartService } from './shoping-cart.service';
import { ShopingCartController } from './shoping-cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ShoppingCart, ShoppingCartSchema } from './entity/shoping-cart.entity';
import { ShoppingCartRepository } from './shopping-cart.repository';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShoppingCart.name, schema: ShoppingCartSchema },
    ]),
    ProductModule
  ],
  providers: [ShopingCartService, ShoppingCartRepository],
  controllers: [ShopingCartController],
})
export class ShopingCartModule {}
