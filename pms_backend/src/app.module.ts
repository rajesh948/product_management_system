import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { CartModule } from './modules/cart/cart.module';
import { CartProductModule } from './modules/cart_product/cart-product.module';
import { CategoryModule } from './modules/category/category.module';
import { CategoryProductModule } from './modules/category_product/category-product.module';
import { EmailModule } from './modules/email/email.module';
import { PermissionModule } from './modules/permission/permission.module';
import { ProductModule } from './modules/product/product.module';
import { RoleModule } from './modules/role/role.module';
import { RolePermissionModule } from './modules/role_permission/role-permission.module';
import { UserModule } from './modules/user/user.module';
import { UserPermissionModule } from './modules/user_permission/user-permission.module';
@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    RoleModule,
    PermissionModule,
    UserPermissionModule,
    RolePermissionModule,
    ProductModule,
    CategoryModule,
    CategoryProductModule,
    CartModule,
    CartProductModule,
    EmailModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
