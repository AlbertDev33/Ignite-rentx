import { classToClass } from 'class-transformer';

import { IUserResponseDTO } from '../dtos/IUserResponseDTO';
import { User } from '../infra/typeorm/entities/User';

export class UserMap {
  static toDTO({
    id,
    name,
    email,
    avatar,
    driver_license,
    avatarUrl,
  }: User): IUserResponseDTO {
    const user = classToClass({
      id,
      name,
      email,
      avatar,
      driver_license,
      avatarUrl,
    });

    return user;
  }
}
