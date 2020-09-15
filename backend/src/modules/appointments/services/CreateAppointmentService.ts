import { startOfHour , isBefore, getHours, format } from "date-fns";
import { injectable, inject } from "tsyringe";

import AppError from "@shared/erros/AppError";

import Appointment from "../infra/typeorm/entities/Appointment";
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import INotificationRepository from "@modules/notifications/repositories/INotificationRepository";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentsService {
  constructor(
    @inject("AppointmentsRepository")
    private appointmentsRepository: IAppointmentsRepository,
    @inject("NotificationRepository")
    private notificationRepository: INotificationRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({ date, provider_id, user_id }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if(isBefore(appointmentDate, Date.now())){
      throw new AppError("You can't create an appointment on a pat date.");
    }

    if (user_id === provider_id) {
      throw new AppError("You can't create an appointment with yourself.");
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError("You can't create an appointment between 8am anda 5pm.");
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id
    );

    if (findAppointmentInSameDate) {
      throw new AppError("This appointment is already booked");
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
      user_id
    });

    const dateFormat = format(appointmentDate, "dd/MM/yyyy 'ás' HH:mm 'h'");

    await this.notificationRepository.create({
      recipient_id: user_id,
      content: `Novo agendamento para o dia ${dateFormat}`, 
    })

    await this.cacheProvider.
      invalidade(`provider-appointments:${provider_id}:${format(appointmentDate, 'yyyy-M-d')}`)

    return appointment;
  }
}

export default CreateAppointmentsService;
