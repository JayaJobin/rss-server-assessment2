import { Post, FeedSource, Author } from '../models';
import { Op } from 'sequelize';

const includeRelations = [
  { model: FeedSource, as: 'feedSource' as const },
  { model: Author, as: 'authorProfile' as const },
];

export interface PostCreateInput {
  slug: string;
  title: string;
  author: string;
  publishedAt: Date;
  category: string;
  summary: string;
  body: string;
  imageUrl?: string | null;
  link?: string | null;
  readTime?: string | null;
  feedSourceId?: number | null;
  authorId?: number | null;
}

export type PostUpdateInput = Partial<PostCreateInput>;

export const postRepository = {
  findAll: () => Post.findAll({ include: includeRelations }),

  count: () => Post.count(),

  findById: (id: number) => Post.findByPk(id, { include: includeRelations }),

  findBySlug: (slug: string) => Post.findOne({ where: { slug }, include: includeRelations }),

  create: (data: PostCreateInput) => Post.create(data),

  updateById: async (id: number, updates: PostUpdateInput) => {
    const post = await Post.findByPk(id);
    if (!post) return null;
    await post.update(updates);
    return post;
  },

  deleteById: async (id: number) => {
    const post = await Post.findByPk(id);
    if (!post) return false;
    await post.destroy();
    return true;
  },

  findAllOrderedByCreatedAt: () => Post.findAll({ order: [['createdAt', 'DESC']] }),

  findByCategoryOrderedByCreatedAt: (category: string) =>
    Post.findAll({
      where: { category: { [Op.like]: category } },
      order: [['createdAt', 'DESC']],
    }),
};
