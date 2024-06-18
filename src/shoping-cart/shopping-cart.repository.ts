import { AbstractRepository } from 'src/common/database/abstract.repository';
import { ShoppingCart } from './entity/shoping-cart.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ProductRepository } from 'src/product/product.repository';
import { NotFoundException } from '@nestjs/common';
import { Product } from 'src/product/entity/product.entity';
import { DecreaseCountDto } from './dto/decraceCount.dto';

export class ShoppingCartRepository extends AbstractRepository<ShoppingCart> {
  constructor(
    @InjectModel(ShoppingCart.name)
    protected shoppingCartModel: Model<ShoppingCart>,
    private readonly productRepository: ProductRepository,
  ) {
    super(shoppingCartModel);
  }

  async createOrUpdateShoppingCart(
    addToCartDto: AddToCartDto,
  ): Promise<ShoppingCart> {
    const { userId } = addToCartDto;

    const userCart = await this.shoppingCartModel
      .findOne({
        userId,
        isPaid: false,
      })
      .lean();

    let productPrice: Product;

    try {
      productPrice = await this.productRepository.findOneDocument(
        addToCartDto.items.product,
        'price' as any,
      );
    } catch (error) {
      throw new NotFoundException('not suh a item exsist');
    }
    if (!userCart) {
      const totalPrice = productPrice.price * addToCartDto.items.count;
      const newUserCart = new this.shoppingCartModel({
        _id: new Types.ObjectId(),
        ...addToCartDto,
        totalPrice: totalPrice,
      });

      newUserCart.items[0].price = productPrice.price;
      await newUserCart.save();
      return newUserCart;
    }

    const isProductExsistInCartIndex = userCart.items.findIndex(
      (item) =>
        (item.product.toHexString() as any) === addToCartDto.items.product,
    );

    let totalPrice: number;

    if (isProductExsistInCartIndex === -1) {
      totalPrice =
        userCart.totalPrice + productPrice.price * addToCartDto.items.count;
      addToCartDto.items.price = productPrice.price;
      userCart.items.push({
        ...addToCartDto.items,
        _id: new Types.ObjectId(),
      });
    } else {
      totalPrice =
        userCart.totalPrice + addToCartDto.items.count * productPrice.price;
      userCart.items[isProductExsistInCartIndex].count +=
        addToCartDto.items.count;
    }

    const newUserCart = await this.shoppingCartModel.findByIdAndUpdate(
      { _id: userCart._id },
      {
        items: userCart.items,
        totalPrice: totalPrice,
      },
      { new: true },
    );
    return newUserCart;
  }
  async getUserActiveCart(userId: Types.ObjectId): Promise<ShoppingCart> {
    const cart = await this.shoppingCartModel.findOne({
      userId,
      isPaid: false,
    });
    if (!cart) {
      throw new NotFoundException('user have no Shopping cart yet.');
    }

    return cart;
  }

  async deacreaseProductCount(
    userId: Types.ObjectId,
    decreaseCountDto: DecreaseCountDto,
  ): Promise<ShoppingCart> {
    const { productId } = decreaseCountDto;
    const userCart = await this.shoppingCartModel.findOne({
      userId,
      isPaid: false,
    });
    if (!userCart) {
      throw new NotFoundException('user have no cart yet.');
    }
    const productIndexInCart = userCart.items.findIndex(
      (item) => item._id == productId,
    );
    if (productIndexInCart === -1) {
      throw new NotFoundException('this product is not on your cart.');
    }
    let totalPrice: number = userCart.totalPrice - userCart.items[productIndexInCart].price;
    let newItems = undefined;
    if (userCart.items[productIndexInCart].count > 1) {
      userCart.items[productIndexInCart].count =
        userCart.items[productIndexInCart].count - 1;
    } else {
      newItems = userCart.items.filter(
        (item) => (item._id.toHexString() as any) !== productId,
      );
    }

    const updatedCart = await this.shoppingCartModel.findByIdAndUpdate(
      { _id: userCart._id },
      {
        totalPrice,
        items: newItems || userCart.items,
      },
      { new: true },
    );

    return updatedCart;
  }
}
