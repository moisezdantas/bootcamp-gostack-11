import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import CreateUserService from "./CreateUserService";
import AppError from "@shared/erros/AppError";
import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUser: CreateUserService;

describe("CreateUser", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider
    );
  });
  it("should be able to create a new user", async () => {
    const user = await createUser.execute({
      name: "John Done",
      email: "jonhdoe@example.com",
      password: "1234",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user with same email from another", async () => {
    await createUser.execute({
      name: "John Done",
      email: "jonhdoe@example.com",
      password: "1234",
    });

    await expect(
      createUser.execute({
        name: "John Done",
        email: "jonhdoe@example.com",
        password: "1234",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
