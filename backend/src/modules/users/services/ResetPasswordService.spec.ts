import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import ResetPasswordService from "./ResetPasswordService";
import AppError from "@shared/erros/AppError";

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe("ResetPasswordService", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider
    );
  });

  it("should be able to reset the password ", async () => {
    const user = await fakeUsersRepository.create({
      name: "John Done",
      email: "jonhdoe@example.com",
      password: "1234",
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, "generateHash");

    await resetPassword.execute({
      password: "12365",
      token,
    });

    const updateUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith("12365");
    expect(updateUser?.password).toBe("12365");
  });

  it("should not be able to reset the password with non-existing token", async () => {
    await expect(
      resetPassword.execute({
        token: "non-existing-token",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to reset the password with non-existing token user", async () => {
    const { token } = await fakeUserTokensRepository.generate(
      "non-existing-user"
    );

    await expect(
      resetPassword.execute({
        token,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to reset the password if passed more than 2 hours", async () => {
    const user = await fakeUsersRepository.create({
      name: "John Done",
      email: "jonhdoe@example.com",
      password: "1234",
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        password: "12365",
        token,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
