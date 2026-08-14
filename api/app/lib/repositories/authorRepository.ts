import { Author, Post } from '../models';

export const authorRepository = {
  findAll: () => Author.findAll({ include: [{ model: Post, as: 'posts' }] }),

  findById: (id: number) => Author.findByPk(id, { include: [{ model: Post, as: 'posts' }] }),

  create: (data: { name: string; email?: string | null }) => Author.create(data),

  updateById: async (id: number, updates: Partial<{ name: string; email: string | null }>) => {
    const author = await Author.findByPk(id);
    if (!author) return null;
    if (updates.name !== undefined) author.name = updates.name;
    if (updates.email !== undefined) author.email = updates.email;
    await author.save();
    return author;
  },

  deleteById: async (id: number) => {
    const author = await Author.findByPk(id);
    if (!author) return false;
    await author.destroy();
    return true;
  },
};
