import { container } from "tsyringe";

import "@modules/users/providers";
import "@shared/container/providers";

import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import AppointmentsRepository from "@modules/appointments/infra/typeorm/repositories/AppointmentsRepository";

import IUserRepository from "@modules/users/repositories/IUsersRepository";
import UsersRepository from "@modules/users/infra/typeorm/repositories/UsersRepository";

import IUserTokensRepository from "@modules/users/repositories/IUserTokensRepository";
import UserTokenRepository from "@modules/users/infra/typeorm/repositories/UserTokenRepository";

import INotificationRepository from "@modules/notifications/repositories/INotificationRepository";
import NotificationRepository from "@modules/notifications/infra/typeorm/repositories/NotificationRepository";

container.registerSingleton<IAppointmentsRepository>(
  "AppointmentsRepository",
  AppointmentsRepository
);

container.registerSingleton<IUserRepository>(
  "UsersRepository",
  UsersRepository
);

container.registerSingleton<IUserTokensRepository>(
  "UserTokensRepository",
  UserTokenRepository
);

container.registerSingleton<INotificationRepository>(
  "NotificationRepository",
  NotificationRepository
);
