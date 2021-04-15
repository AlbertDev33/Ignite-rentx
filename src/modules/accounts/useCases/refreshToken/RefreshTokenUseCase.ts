import { verify, sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '@config/auth';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IPayload {
  sub: string;
  email: string;
}

interface ITokenResponse {
  token: string;
  refresh_token: string;
}

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRespository: IUsersTokensRepository,

    @inject('DateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute(token: string): Promise<ITokenResponse> {
    const {
      secret_refresh_token,
      expires_refresh_token_days,
      expires_in_refresh_token,
      expires_in_token,
      secret_token,
    } = auth;

    const { sub, email } = verify(token, secret_refresh_token) as IPayload;

    const user_id = sub;

    const userToken = await this.usersTokensRespository.findByUserIdAndRefreshToken(
      user_id,
      token,
    );

    if (!userToken) {
      throw new AppError('Refresh Token Does Not Exists!');
    }

    await this.usersTokensRespository.deleteById(userToken.id);

    const expires_date = this.dateProvider.addDays(expires_refresh_token_days);

    const refresh_token = sign({ email }, secret_refresh_token, {
      subject: sub,
      expiresIn: expires_in_refresh_token,
    });

    const newToken = sign({}, secret_token, {
      subject: user_id,
      expiresIn: expires_in_token,
    });

    await this.usersTokensRespository.create({
      user_id,
      refresh_token,
      expires_date,
    });

    return {
      refresh_token,
      token: newToken,
    };
  }
}
