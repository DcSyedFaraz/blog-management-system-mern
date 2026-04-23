import Joi from 'joi';

export const createPostSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  content: Joi.string().min(10).required(),
  tags: Joi.array().items(Joi.string().trim()).default([]),
  status: Joi.string().valid('draft', 'published').default('draft'),
});

export const updatePostSchema = Joi.object({
  title: Joi.string().min(3).max(200),
  content: Joi.string().min(10),
  tags: Joi.array().items(Joi.string().trim()),
  status: Joi.string().valid('draft', 'published'),
}).min(1);

export const statusSchema = Joi.object({
  status: Joi.string().valid('draft', 'published').required(),
});

export const commentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required(),
});
