import FakeStorageProvider from "@shared/container/providers/StorageProvider/fakes/FakeStorageProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import UpdateUserAvatarService from "./UpdateUserAvatarService";
import AppError from "@shared/erros/AppError";

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe("UpdateUserAvaTar", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );
  });

  it("should be able to create a new user", async () => {
    const user = await fakeUsersRepository.create({
      name: "John Done",
      email: "jonhdoe@example.com",
      password: "1234",
    });

    await updateUserAvatar.execute({
      user_Id: user.id,
      avatarFileName: "avatar.png",
    });

    expect(user.avatar).toBe("avatar.png");
  });

  it("should not be able to update avatar from non existing user", async () => {
    await expect(
      updateUserAvatar.execute({
        user_Id: "non-existing-user",
        avatarFileName: "avatar.png",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should delete old avatar when updating new one", async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, "deleteFile");
    const user = await fakeUsersRepository.create({
      name: "John Done",
      email: "jonhdoe@example.com",
      password: "1234",
    });

    await updateUserAvatar.execute({
      user_Id: user.id,
      avatarFileName: "avatar.png",
    });

    await updateUserAvatar.execute({
      user_Id: user.id,
      avatarFileName: "avatar2.png",
    });

    expect(deleteFile).toHaveBeenCalledWith("avatar.png");

    expect(user.avatar).toBe("avatar2.png");
  });
});
