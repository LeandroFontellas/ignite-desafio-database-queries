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
    return this.repository.findOneOrFail({where:{id:user_id},relations:["games"]})
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query("SELECT * FROM users ORDER BY users.first_name"); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    // Provavelmente tem um jeito mais simples de fazer isso.
    let [firstChar1,rest1] = first_name.split(first_name.charAt(0),2);
    firstChar1= first_name.charAt(0).toUpperCase()
    rest1=rest1.toLowerCase();
    let [firstChar2,rest2] = last_name.split(last_name.charAt(0),2);
    firstChar2= last_name.charAt(0).toUpperCase()
    rest2=rest2.toLowerCase()
    return this.repository.query(`SELECT * FROM users WHERE users.first_name = $1 AND users.last_name = $2`,[firstChar1+rest1,firstChar2+rest2]); // Complete usando raw query
  }
}
