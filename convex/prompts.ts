import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getCurrentUser, getCurrentUserOrThrow } from './users';

export const createPrompt = mutation({
  args: {
    question: v.string(),
    answer: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserOrThrow(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated!');
    }
    const user = await ctx.db.get(userId._id);

    if (!user) {
      throw new Error('User not found');
    }

    const promptId = await ctx.db.insert('prompts', {
      userId: user._id,
      question: args.question,
      answer: args.answer,
    });

    return promptId;
  },
});

export const deletePrompt = mutation({
  args: {
    promptId: v.id('prompts'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated call to createPrompt');
    }

    await ctx.db.delete(args.promptId);
  },
});

// Updated query to fetch prompts for a user
export const getUserPrompts = query({
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error('Unauthenticated');
    }

    const prompts = await ctx.db
      .query('prompts')
      .filter((q) => q.eq(q.field('userId'), user._id))
      .collect();

    return prompts;
  },
});
