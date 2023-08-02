import { Sequelize } from 'sequelize-typescript';
import { DEVELOPMENT, PRODUCTION, SEQUELIZE, TEST } from 'src/constant';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Cart_Product } from 'src/modules/cart_product/entities/cart-product.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { Category_Product } from 'src/modules/category_product/entities/category-product.entity';
import { Permission } from 'src/modules/permission/entities/permission.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { Role_Permission } from 'src/modules/role_permission/entities/role-permission.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { User_Permission } from 'src/modules/user_permission/entities/user-permission.entity';
import { databaseConfig } from './database.config';

export const databaseProvider = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }

      const sequelize = new Sequelize(config);
      sequelize.addModels([
        User,
        Role,
        Permission,
        Role_Permission,
        User_Permission,
        Category,
        Product,
        Category_Product,
        Cart,
        Cart_Product,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
