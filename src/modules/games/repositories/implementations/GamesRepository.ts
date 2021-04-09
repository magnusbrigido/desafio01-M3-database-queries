import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository
      .createQueryBuilder('game')
      .where('lower(game.title) like :title', { title: `%${param.toLowerCase()}%`}).getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query('select count(*) from games');
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return await this.repository
      .createQueryBuilder().relation(Game, 'users').of(id).loadMany();
  }
}
