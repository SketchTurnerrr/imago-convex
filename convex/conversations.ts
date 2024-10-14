import { query } from './_generated/server';
import { v } from 'convex/values';
import { filter } from 'convex-helpers/server/filter';

export const getUserConversations = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    const profileId = identity.subject;

    const profile = await ctx.db
      .query('profiles')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', profileId))
      .first();

    if (!profile) throw new Error('Profile not found');

    const conversations = await filter(
      ctx.db.query('conversations'),

      (q) => q.participantIds.includes(profile._id)
    ).collect();

    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conversation) => {
        const otherParticipantId = conversation.participantIds.find(
          (id) => id !== profile._id
        );

        if (!otherParticipantId) {
          return null;
        }
        const otherParticipant = await ctx.db.get(otherParticipantId);

        if (!otherParticipant) {
          return null;
        }
        const otherParticipantPhoto = await ctx.db
          .query('photos')
          .filter((q) => q.eq(q.field('profileId'), otherParticipant._id))
          .first();

        const lastMessage = await ctx.db
          .query('messages')
          .withIndex('by_conversation', (q) =>
            q.eq('conversationId', conversation._id)
          )
          .order('desc')
          .first();

        return {
          ...conversation,
          otherParticipant,
          otherParticipantPhoto,
          lastMessage,
        };
      })
    );

    return conversationsWithDetails;
  },
});
