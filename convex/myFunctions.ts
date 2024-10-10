import { v } from 'convex/values';
import { query, mutation, action } from './_generated/server';
import { api } from './_generated/api';
import { Id } from './_generated/dataModel';

// Updated mutation for creating a prompt
export const createPrompt = mutation({
  args: {
    question: v.string(),
    answer: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log('identity :', identity);
    if (!identity) {
      throw new Error('Unauthenticated call to createPrompt');
    }

    const profile = await ctx.db
      .query('profiles')
      .filter((q) => q.eq(q.field('clerkId'), identity.subject))
      .first();

    if (!profile) {
      throw new Error('User profile not found');
    }

    const promptId = await ctx.db.insert('prompts', {
      profileId: profile._id,
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
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    // Find the profile associated with this user
    const profile = await ctx.db
      .query('profiles')
      .filter((q) => q.eq(q.field('clerkId'), identity.subject))
      .first();

    if (!profile) {
      return [];
    }

    const prompts = await ctx.db
      .query('prompts')
      .filter((q) => q.eq(q.field('profileId'), profile._id))
      .collect();

    return prompts;
  },
});

export const getUserPhotos = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const profile = await ctx.db
      .query('profiles')
      .filter((q) => q.eq(q.field('clerkId'), identity.subject))
      .first();

    if (!profile) return [];

    return ctx.db
      .query('photos')
      .filter((q) => q.eq(q.field('profileId'), profile._id))
      .collect();
  },
});

export const addPhoto = mutation({
  args: { url: v.string(), order: v.number() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    const profile = await ctx.db
      .query('profiles')
      .filter((q) => q.eq(q.field('clerkId'), identity.subject))
      .first();

    if (!profile) throw new Error('Profile not found');

    return ctx.db.insert('photos', {
      profileId: profile._id,
      url: args.url,
      order: args.order,
    });
  },
});

export const removePhoto = mutation({
  args: { id: v.id('photos') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    const photo = await ctx.db.get(args.id);
    if (!photo) throw new Error('Photo not found');

    const profile = await ctx.db.get(photo.profileId);
    if (!profile || profile.clerkId !== identity.subject) {
      throw new Error('Unauthorized');
    }

    // Extract the fileKey from the URL
    const fileKey = photo.url.split('/').pop();
    if (!fileKey) throw new Error('Invalid fileKey');

    // Call the mutation to delete the file from UploadThing

    // Delete the photo from the database
    await ctx.db.delete(args.id);
  },
});

export const deleteFromUploadThing = action({
  args: { fileKey: v.string() },
  handler: async (ctx, args) => {
    ctx.runAction;
    const result = await fetch(`http://localhost:3000/api/uploadthing/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ fileKey: args.fileKey }),
    });
    console.log('result :', result);

    if (!result.ok) {
      throw new Error('Failed to delete file from UploadThing');
    }
  },
});

export const updatePhotoOrder = mutation({
  args: {
    newOrder: v.array(v.object({ id: v.id('photos'), order: v.number() })),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    for (const { id, order } of args.newOrder) {
      await ctx.db.patch(id, { order });
    }
  },
});

export const editProfile = mutation({
  args: {
    name: v.string(),
    gender: v.string(),
    denomination: v.string(),
    location: v.string(),
    custom_location: v.string(),
    onboarded: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    const profile = await ctx.db
      .query('profiles')
      .filter((q) => q.eq(q.field('clerkId'), identity.subject))
      .first();

    if (!profile) throw new Error('Profile not found');

    await ctx.db.patch(profile._id, {
      name: args.name,
      gender: args.gender,
      denomination: args.denomination,
      location: args.location,
      custom_location: args.custom_location,
      onboarded: args.onboarded,
    });
  },
});
