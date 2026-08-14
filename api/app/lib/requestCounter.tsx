import { requestCounterRepository } from './repositories/requestCounterRepository';

export const incrementRequestCount = requestCounterRepository.increment;
export const getRequestCount = requestCounterRepository.get;
