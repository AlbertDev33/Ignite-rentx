import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DateProvider } from '@shared/container/providers/DateProvider/implementations/DateProvider';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import { AppError } from '@shared/errors/AppError';

import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase';

let sendForgotPasswordMailuseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DateProvider;
let mailProvider: MailProviderInMemory;

describe('Send Forgot Mail', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DateProvider();
    mailProvider = new MailProviderInMemory();

    sendForgotPasswordMailuseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider,
    );
  });

  it('Should be able to send a forgot password mail to user', async () => {
    const sendMail = spyOn(mailProvider, 'sendMail');

    await usersRepositoryInMemory.create({
      driver_license: '78945',
      email: 'validmail@mail.com',
      name: 'John Doe',
      password: 'valid_password',
    });

    await sendForgotPasswordMailuseCase.execute('validmail@mail.com');

    expect(sendMail).toHaveBeenCalled();
  });

  it('Should not be able to send an email if user does not exists', async () => {
    await expect(
      sendForgotPasswordMailuseCase.execute('invalid_email'),
    ).rejects.toEqual(new AppError('User does not exists!'));
  });

  it('Should be able to create an users token', async () => {
    const generateTokenMail = spyOn(usersTokensRepositoryInMemory, 'create');

    await usersRepositoryInMemory.create({
      driver_license: '7845612',
      email: 'valid@mail.com',
      name: 'John Doe',
      password: 'valid_password',
    });

    await sendForgotPasswordMailuseCase.execute('valid@mail.com');

    expect(generateTokenMail).toBeCalled();
  });
});
