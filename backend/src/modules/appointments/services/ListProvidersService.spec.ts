import AppError from "@shared/erros/AppError";

import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import ListProvidersService from "./ListProvidersService";
import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider";

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ListProvidersService;

describe("ListProfile", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider
    );
  });

  it("should be able to lits the providers", async () => {
    const user1 = await fakeUsersRepository.create({
      name: "John Done",
      email: "jonhdoe@example.com",
      password: "1234",
    });

    const user2 = await fakeUsersRepository.create({
      name: "John Trê",
      email: "jonhtre@example.com",
      password: "1234",
    });

    const loggedUser = await fakeUsersRepository.create({
      name: "John Qua",
      email: "jonhqua@example.com",
      password: "1234",
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
