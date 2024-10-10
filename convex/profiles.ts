import { internalMutation, query, QueryCtx } from './_generated/server';
import { UserJSON } from '@clerk/backend';
import { v, Validator } from 'convex/values';
import { queryWithUser } from './utils';

export const createProfile = internalMutation({
  args: {
    email: v.string(),
    clerkId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('profiles', {
      clerkId: args.clerkId,
      name: args.email,
      email: args.email,
      gender: 'male',
      denomination: 'other',
      verified: false,
      onboarded: false,
      location: '',
      custom_location: '',
    });
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    const userAttributes = {
      clerkId: data.id,
      name: `${data.first_name} `,
      onboarded: false,
      location: '',
      custom_location: '',
      email: data.email_addresses[0].email_address,
      gender: 'male',
      denomination: 'other',
      verified: false,
    };

    const user = await userByClerkId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert('profiles', userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByClerkId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`
      );
    }
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByClerkId(ctx, identity.subject);
}

export async function userByClerkId(ctx: QueryCtx, clerkId: string) {
  return await ctx.db
    .query('profiles')
    .withIndex('byClerkId', (q) => q.eq('clerkId', clerkId))
    .unique();
}

export const current = queryWithUser({
  args: {},
  handler: async (ctx) => {
    const { identity } = ctx;

    const profile = await ctx.db
      .query('profiles')
      .filter((q) => q.eq(q.field('clerkId'), identity.subject))
      .first();

    if (!profile) {
      throw new Error('Profile not found');
    }

    return profile;
  },
});
