import { RequestCounter } from '../models';

async function getOrCreateCounterRow() {
  const [counter] = await RequestCounter.findOrCreate({
    where: { id: 1 },
    defaults: { count: 0 },
  });
  return counter;
}

export const requestCounterRepository = {
  increment: async (): Promise<number> => {
    const counter = await getOrCreateCounterRow();
    await counter.increment('count');
    await counter.reload();
    return counter.count;
  },

  get: async (): Promise<number> => {
    const counter = await getOrCreateCounterRow();
    return counter.count;
  },
};
