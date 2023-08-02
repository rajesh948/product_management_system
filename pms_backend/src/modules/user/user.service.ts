import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/constant';
import { Cart } from '../cart/entities/cart.entity';
import { Permission } from '../permission/entities/permission.entity';
import { Role } from '../role/entities/role.entity';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}
  async create(user: UserDto): Promise<User> {
    return await this.userRepository.create<User>(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll<User>({
      include: [Role, Permission],
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne<User>({
      where: { email },
      include: [
        {
          model: Role,
          include: [Permission],
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        { model: Permission },
        { model: Cart },
      ],
    });
  }
  async findByPk(userId: number): Promise<User> {
    return await this.userRepository.findByPk<User>(userId);
  }

  async update(id: number, user: UserDto) {
    const userData = await this.userRepository.findOne({ where: { id } });
    if (!userData) return null;
    if (user.password) user.password = await this.hashPassword(user.password);

    return await userData.update({ ...user });
  }
  async forgotPassword(user: { email: string; password: string }) {
    const userData = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (!userData) return null;
    if (user.password) user.password = await this.hashPassword(user.password);

    return await userData.update({ ...user });
  }

  async delete(id: number) {
    return await this.userRepository.destroy({ where: { id } });
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
