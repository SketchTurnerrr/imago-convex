import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { getCurrentUserOrThrow } from './users';

export const sendMessage = mutation({
  args: {
    conversationId: v.id('conversations'),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserOrThrow(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated!');
    }

    const profile = await ctx.db
      .query('users')
      .withIndex('by_id', (q) => q.eq('_id', userId._id))
      .first();

    if (!profile) throw new Error('Profile not found');

    const message = await ctx.db.insert('messages', {
      conversationId: args.conversationId,
      senderId: profile._id,
      content: args.content,
    });

    // Update the conversation's lastMessageTime
    await ctx.db.patch(args.conversationId, {
      lastMessageTime: Date.now(),
    });

    return message;
  },
});
