import { v } from 'convex/values';
import { query, mutation, action } from './_generated/server';
import { api } from './_generated/api';
import { Id } from './_generated/dataModel';

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

// You can read data from the database via a query:
export const listNumbers = query({
  // Validators for arguments.
  args: {
    count: v.number(),
  },

  // Query implementation.
  handler: async (ctx, args) => {
    //// Read the database as many times as you need here.
    //// See https://docs.convex.dev/database/reading-data.
    const numbers = await ctx.db
      .query('numbers')
      // Ordered by _creationTime, return most recent
      .order('desc')
      .take(args.count);
    return {
      viewer: (await ctx.auth.getUserIdentity())?.name ?? null,
      numbers: numbers.reverse().map((number) => number.value),
    };
  },
});

// You can write data to the database via a mutation:
export const addNumber = mutation({
  // Validators for arguments.
  args: {
    value: v.number(),
  },

  // Mutation implementation.
  handler: async (ctx, args) => {
    //// Insert or modify documents in the database here.
    //// Mutations can also read from the database like queries.
    //// See https://docs.convex.dev/database/writing-data.

    const id = await ctx.db.insert('numbers', { value: args.value });

    console.log('Added new document with id:', id);
    // Optionally, return a value from your mutation.
    // return id;
  },
});

// You can fetch data from and send data to third-party APIs via an action:
export const myAction = action({
  // Validators for arguments.
  args: {
    first: v.number(),
    second: v.string(),
  },

  // Action implementation.
  handler: async (ctx, args) => {
    //// Use the browser-like `fetch` API to send HTTP requests.
    //// See https://docs.convex.dev/functions/actions#calling-third-party-apis-and-using-npm-packages.
    // const response = await ctx.fetch("https://api.thirdpartyservice.com");
    // const data = await response.json();

    //// Query data by running Convex queries.
    const data = await ctx.runQuery(api.myFunctions.listNumbers, {
      count: 10,
    });
    console.log(data);

    //// Write data by running Convex mutations.
    await ctx.runMutation(api.myFunctions.addNumber, {
      value: args.first,
    });
  },
});

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
