import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { UpdateNotEmptyPipe } from './common/pipes/update-not-empty-input-check.pipe';
import { AdminGuard } from './auth/guards/admin.guard';
import { JwtGuard } from './auth/guards/jwt.guard';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import { CategoryModule } from './category/category.module';
import { ShopingCartModule } from './shoping-cart/shoping-cart.module';
import { RefreshTokenGuard } from './auth/guards/refresh-token.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    ShopingCartModule,
  ],
  providers: [
    UpdateNotEmptyPipe,
    AdminGuard,
    JwtGuard,
    JwtStrategy,
  ],
})
export class AppModule {}
