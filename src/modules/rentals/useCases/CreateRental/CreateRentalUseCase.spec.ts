import dayjs from 'dayjs';

import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { DateProvider } from '@shared/container/providers/DateProvider/implementations/DateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dateProvider: DateProvider;

describe('Create Rental', () => {
  const dayAdd24Hours = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dateProvider = new DateProvider();
    carsRepositoryInMemory = new CarsRepositoryInMemory();

    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dateProvider,
      carsRepositoryInMemory,
    );
  });

  it('Should be able to create a new rental', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'car_test',
      description: 'description_test',
      daily_rate: 100,
      license_plate: 'license_test',
      fine_amount: 40,
      category_id: 'valid_id',
      brand: 'brand_test',
    });

    const rental = await createRentalUseCase.execute({
      user_id: '123456',
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('Should not be able to create a new rental if there is another open to the same user', async () => {
    await rentalsRepositoryInMemory.create({
      car_id: '11111',
      user_id: '123456',
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: '123456',
        car_id: '121212',
        expected_return_date: dayAdd24Hours,
      }),
    ).rejects.toEqual(new AppError("There's a rental in progress for user!"));
  });

  it('Should not be able to create a new rental if there is another open to the same car', async () => {
    await rentalsRepositoryInMemory.create({
      car_id: 'test',
      user_id: '123',
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: '321',
        car_id: 'test',
        expected_return_date: dayAdd24Hours,
      }),
    ).rejects.toEqual(new AppError('Car is unavailable'));
  });

  it('Should not be able to create a new rental with invalid return time', async () => {
    await expect(
      createRentalUseCase.execute({
        user_id: '123',
        car_id: 'test',
        expected_return_date: dayjs().toDate(),
      }),
    ).rejects.toEqual(new AppError('Invalid return time!'));
  });
});
