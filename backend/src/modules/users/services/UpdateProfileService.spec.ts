import AppError from "@shared/erros/AppError";

import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import UpdateProfileService from "./UpdateProfileService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe("UpdateProfile", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it("should be able update the profile", async () => {
    const user = await fakeUsersRepository.create({
      name: "John Done",
      email: "jonhdoe@example.com",
      password: "1234",
    });

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: "John Trê",
      email: "jonhtre@example.com",
    });

    expect(updateUser.name).toBe("John Trê");
    expect(updateUser.email).toBe("jonhtre@example.com");
  });

  it("should not be able update the profile from non_existing user", async () => {
    expect(
      updateProfile.execute({
        user_id: "non_existing",
        name: "John Trê",
        email: "jonhtre@example.com",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to change to another user email", async () => {
    await fakeUsersRepository.create({
      name: "John Done",
      email: "jonhdoe@example.com",
      password: "1234",
    });

    const user = await fakeUsersRepository.create({
      name: "Test",
      email: "test@example.com",
      password: "1234",
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: "John Done",
        email: "jonhdoe@example.com",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should be able update the password", async () => {
    const user = await fakeUsersRepository.create({
      name: "John Done",
      email: "jonhdoe@example.com",
      password: "1234",
    });

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: "John Trê",
      email: "jonhtre@example.com",
      old_password: "1234",
      password: "123123",
    });

    expect(updateUser.password).toBe("123123");
  });

  it("should not be able to update the password without old password", async () => {
    const user = await fakeUsersRepository.create({
      name: "John Done",
      email: "jonhdoe@example.com",
      password: "123123",
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: "John Trê",
        email: "jonhtre@example.com",
        password: "123123",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to update the password with wrong old password", async () => {
    const user = await fakeUsersRepository.create({
      name: "John Done",
      email: "jonhdoe@example.com",
      password: "123123",
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: "John Trê",
        email: "jonhtre@example.com",
        old_password: "wrong-old-password",
        password: "123123",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
