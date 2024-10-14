import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

import { asyncMap } from 'convex-helpers';

export const addLike = mutation({
  args: {
    likerId: v.id('profiles'),
    likedProfileId: v.id('profiles'),
    itemId: v.union(v.id('photos'), v.id('prompts')),
    itemType: v.union(v.literal('photo'), v.literal('prompt')),
  },
  handler: async (ctx, args) => {
    const { likerId, likedProfileId, itemId, itemType } = args;
    ``;

    // Fetch liker's information
    const liker = await ctx.db.get(likerId);
    if (!liker) throw new Error('Liker not found');

    return await ctx.db.insert('likes', {
      likerId,

      likedProfileId,
      itemId,
      itemType,
    });
  },
});

export const removeLike = mutation({
  args: {
    likerId: v.id('profiles'),
    itemId: v.union(v.id('photos'), v.id('prompts')),
  },
  handler: async (ctx, args) => {
    const { likerId, itemId } = args;
    const like = await ctx.db
      .query('likes')
      .withIndex('by_liker_and_item', (q) =>
        q.eq('likerId', likerId).eq('itemId', itemId)
      )
      .first();
    if (like) {
      await ctx.db.delete(like._id);
    }
  },
});

export const getLikesForUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const profileId = identity.subject;

    const profile = await ctx.db
      .query('profiles')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', profileId))
      .first();

    if (!profile) {
      throw new Error('Unauthenticated');
    }

    const likes = await ctx.db
      .query('likes')
      .withIndex('by_liked_profile', (q) =>
        q.eq('likedProfileId', profile?._id)
      )
      .order('desc')
      .collect();

    const likesWithDetails = await asyncMap(likes, async (like) => {
      const liker = await ctx.db.get(like.likerId);

      if (!liker) throw new Error('Liker not found');

      const likerPhoto = await ctx.db
        .query('photos')
        .withIndex('by_profileId', (q) => q.eq('profileId', liker._id))
        .first();

      let item;

      if (like.itemType === 'photo') {
        item = await ctx.db.get(like.itemId);
      } else if (like.itemType === 'prompt') {
        item = await ctx.db.get(like.itemId);
      }
      return {
        ...like,
        liker,
        likerPhoto,
        item,
      };
    });

    return likesWithDetails;
  },
});

export const getLikeById = query({
  args: {
    likeId: v.id('likes'),
  },
  handler: async (ctx, args) => {
    const { likeId } = args;

    const like = await ctx.db.get(likeId);
    if (!like) {
      return null; // Or throw an error if you prefer
    }

    const liker = await ctx.db.get(like.likerId);
    const likedProfile = await ctx.db.get(like.likedProfileId);

    let item;
    if (like.itemType === 'photo') {
      item = await ctx.db.get(like.itemId);
    } else if (like.itemType === 'prompt') {
      item = await ctx.db.get(like.itemId);
    }

    // Fetch the first photo of the liker for their profile picture
    const likerPhoto = await ctx.db
      .query('photos')
      .withIndex('by_profileId', (q) => q.eq('profileId', like.likerId))
      .first();

    return {
      ...like,
      liker: {
        ...liker,
        profilePicture: likerPhoto?.url,
      },
      likedProfile,
      item,
    };
  },
});
