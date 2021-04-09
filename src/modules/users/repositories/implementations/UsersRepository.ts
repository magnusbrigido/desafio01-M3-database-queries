import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOne({
      relations: ["games"],
      where: {
         id: user_id
      }
    });

    if(!user) throw new Error('User not found');

    return user;
  } 

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return await this.repository.query('select * from users order by first_name');
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return await this.repository
      .query('select * from users where lower(first_name) = $1 and lower(last_name) = $2', [first_name.toLowerCase(), last_name.toLowerCase()]);
  }
}
