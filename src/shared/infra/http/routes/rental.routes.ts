import { Router } from 'express';

import { CreateRentalController } from '@modules/rentals/useCases/CreateRental/CreateRentalController';
import { DevolutionRentalController } from '@modules/rentals/useCases/devolutionRental/DevolutionRentalController';
import { ListRentalsByUserController } from '@modules/rentals/useCases/listRentalsByUser/ListRentalByUserController';

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

export const rentalRoutes = Router();

const createRentalController = new CreateRentalController();
const devolutiopnRentalController = new DevolutionRentalController();
const listRentasByUserController = new ListRentalsByUserController();

rentalRoutes.post('/', ensureAuthenticated, createRentalController.handle);
rentalRoutes.post(
  '/devolution/:rental_id',
  ensureAuthenticated,
  devolutiopnRentalController.handle,
);

rentalRoutes.get(
  '/user',
  ensureAuthenticated,
  listRentasByUserController.handle,
);
