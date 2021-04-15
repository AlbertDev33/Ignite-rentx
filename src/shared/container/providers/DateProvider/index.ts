import { container } from 'tsyringe';

import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { DateProvider } from '@shared/container/providers/DateProvider/implementations/DateProvider';

container.registerSingleton<IDateProvider>('DateProvider', DateProvider);
