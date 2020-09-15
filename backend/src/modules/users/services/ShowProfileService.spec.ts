import AppError from "@shared/erros/AppError";

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import ShowProfileService from "./ShowProfileService";

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe("ShowProfile", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it("should be able show the profile", async () => {
    const user = await fakeUsersRepository.create({
      name: "John Done",
      email: "jonhdoe@example.com",
      password: "1234",
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe("John Done");
    expect(profile.email).toBe("jonhdoe@example.com");

  });


  it("should not be able show the profile from non_existing user", async () => {
    expect(showProfile.execute({
        user_id: 'non_existing,'
      })).rejects.toBeInstanceOf(AppError);
    
  });
});
