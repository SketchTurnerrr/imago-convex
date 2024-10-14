import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const createMatch = mutation({
  args: {
    receiverId: v.id('profiles'),
    likeId: v.id('likes'),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    const initiator = await ctx.db
      .query('profiles')
      .filter((q) => q.eq(q.field('clerkId'), identity.subject))
      .first();
    if (!initiator) throw new Error('Initiator profile not found');

    // Create the match
    const matchId = await ctx.db.insert('matches', {
      initiatorId: initiator._id,
      receiverId: args.receiverId,
      likeId: args.likeId,
      comment: args.comment,
      status: 'pending',
    });

    // Create a conversation
    const conversationId = await ctx.db.insert('conversations', {
      participantIds: [initiator._id, args.receiverId],
      lastMessageTime: Date.now(),
    });

    // If there's a comment, add it as the first message
    if (args.comment) {
      await ctx.db.insert('messages', {
        conversationId,
        senderId: initiator._id,
        content: args.comment,
      });
    }

    return { matchId, conversationId };
  },
});

export const getLikeForMatch = query({
  args: { likeId: v.id('likes') },
  handler: async (ctx, args) => {
    const like = await ctx.db.get(args.likeId);
    if (!like) throw new Error('Like not found');

    const liker = await ctx.db.get(like.likerId);
    if (!liker) throw new Error('Liker not found');

    const likerPhoto = await ctx.db
      .query('photos')
      .filter((q) => q.eq(q.field('profileId'), like.likerId))
      .first();

    return {
      like,
      liker: {
        ...liker,
        photo: likerPhoto,
      },
    };
  },
});
