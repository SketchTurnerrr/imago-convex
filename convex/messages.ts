// import { mutation } from './_generated/server';
// import { v } from 'convex/values';

// export const sendMessage = mutation({
//   args: {
//     conversationId: v.id('conversations'),
//     content: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error('Unauthenticated');

//     const profile = await ctx.db
//       .query('profiles')
//       .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
//       .first();

//     if (!profile) throw new Error('Profile not found');

//     const message = await ctx.db.insert('messages', {
//       conversationId: args.conversationId,
//       senderId: profile._id,
//       content: args.content,
//     });

//     // Update the conversation's lastMessageTime
//     await ctx.db.patch(args.conversationId, {
//       lastMessageTime: Date.now(),
//     });

//     return message;
//   },
// });
