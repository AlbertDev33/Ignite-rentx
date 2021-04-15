import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateUserAvatarUseCase } from './UpdateUserAvatarUseCase';

export class UpdateUserAvatarController {
  async hendle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { filename } = request.file;

    const updateUserAvatarUseCase = container.resolve(UpdateUserAvatarUseCase);

    await updateUserAvatarUseCase.execute({
      user_id: id,
      avatar_file: filename,
    });

    return response.status(204).send();
  }
}
