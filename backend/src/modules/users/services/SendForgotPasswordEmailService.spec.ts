import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeEmailProvider from "@shared/container/providers/MailProvider/fakes/FakeMailProvider";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";
import SendForgotPasswordEmailService from "./SendForgotPasswordEmailService";
import AppError from "@shared/erros/AppError";

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeEmailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe("SendForgotPasswordEmail", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeEmailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository
    );
  });

  it("should be able to recover the password using the email", async () => {
    const sendMail = jest.spyOn(fakeMailProvider, "sendMail");
    SendForgotPasswordEmailService;

    await fakeUsersRepository.create({
      name: "John Done",
      email: "jonhdoe@example.com",
      password: "1234",
    });

    await sendForgotPasswordEmail.execute({
      email: "jonhdoe@example.com",
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it("should not be able to recover a non-existing user password", async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: "jonhdoe@example.com",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should generate a forgot password token", async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, "generate");

    const user = await fakeUsersRepository.create({
      name: "John Done",
      email: "jonhdoe@example.com",
      password: "1234",
    });

    await sendForgotPasswordEmail.execute({
      email: "jonhdoe@example.com",
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
