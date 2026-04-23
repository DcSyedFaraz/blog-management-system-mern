import Post from '../models/Post.js';

export const getPostStats = async (req, res) => {
  const [counts, topAuthors] = await Promise.all([
    Post.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]),
    Post.aggregate([
      {
        $group: {
          _id: '$author',
          postCount: { $sum: 1 },
          publishedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] },
          },
        },
      },
      { $sort: { postCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'author',
        },
      },
      { $unwind: '$author' },
      {
        $project: {
          _id: 0,
          name: '$author.name',
          email: '$author.email',
          postCount: 1,
          publishedCount: 1,
        },
      },
    ]),
  ]);

  const totalPosts = counts.reduce((acc, c) => acc + c.count, 0);
  const publishedPosts = counts.find((c) => c._id === 'published')?.count || 0;
  const draftPosts = counts.find((c) => c._id === 'draft')?.count || 0;

  res.json({ totalPosts, publishedPosts, draftPosts, topAuthors });
};
