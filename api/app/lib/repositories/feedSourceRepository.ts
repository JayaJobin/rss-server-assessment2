import { FeedSource } from '../models';

export const feedSourceRepository = {
  findAll: () => FeedSource.findAll(),

  count: () => FeedSource.count(),

  findById: (id: number) => FeedSource.findByPk(id),

  create: (data: { name: string; url: string }) => FeedSource.create(data),

  updateById: async (id: number, updates: Partial<{ name: string; url: string }>) => {
    const source = await FeedSource.findByPk(id);
    if (!source) return null;
    if (updates.name !== undefined) source.name = updates.name;
    if (updates.url !== undefined) source.url = updates.url;
    await source.save();
    return source;
  },

  deleteById: async (id: number) => {
    const source = await FeedSource.findByPk(id);
    if (!source) return false;
    await source.destroy();
    return true;
  },
};
