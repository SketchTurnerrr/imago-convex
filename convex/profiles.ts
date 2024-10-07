import { internalMutation, query, QueryCtx } from './_generated/server';
import { UserJSON } from '@clerk/backend';
import { v, Validator } from 'convex/values';

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

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
      age: 17,
    });
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    const userAttributes = {
      clerkId: data.id,
      name: `${data.first_name} `,
      age: 17,
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

async function userByClerkId(ctx: QueryCtx, clerkId: string) {
  return await ctx.db
    .query('profiles')
    .withIndex('byClerkId', (q) => q.eq('clerkId', clerkId))
    .unique();
}
