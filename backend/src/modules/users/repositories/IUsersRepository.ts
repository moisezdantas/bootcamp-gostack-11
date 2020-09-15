import User from "@modules/users/infra/typeorm/entities/User";
import ICreateUserDTO from "@modules/users/dtos/ICreateUserDTO";
import IFinAllProvidersDTO from "@modules/users/dtos/IFindAllProvidersDTO";

export default interface IUsersRepository {
  findAllProviders(data: IFinAllProvidersDTO): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(data: User): Promise<User>;
}
