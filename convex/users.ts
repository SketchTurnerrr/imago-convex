import {
  internalMutation,
  query,
  QueryCtx,
  mutation,
} from './_generated/server';
import { UserJSON } from '@clerk/backend';

import { v, Validator } from 'convex/values';
import { locations } from '../lib/constants';

export const updateUser = mutation({
  args: {
    name: v.string(),
    dob: v.string(),
    gender: v.string(),
    denomination: v.string(),
    location: v.string(),
    custom_location: v.optional(v.string()),
    onboarded: v.boolean(),
    verified: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user === null) {
      throw new Error('Client is not authenticated!');
    }

    await ctx.db.patch(user?._id, {
      name: args.name,
      dob: args.dob,
      gender: args.gender,
      denomination: args.denomination,
      location: args.location,
      custom_location: args.custom_location,
      random: Math.random(),
      onboarded: args.onboarded,
      verified: args.verified,
    });
  },
});

const randomGender = () => {
  const gender = Math.random() > 0.5 ? 'male' : 'female';
  return gender;
};

const denominations = [
  'Католізм',
  "Православ'я",
  'Євангелізм',
  'Баптизм',
  "П'ятидесятництво",
  'Неконфесійна',
  'Інше',
];

const randomDenomination = () => {
  const denomination =
    denominations[Math.floor(Math.random() * denominations.length)];
  return denomination;
};

export const createFake = internalMutation(async (ctx) => {
  for (let i = 10; i < 100; i++) {
    const userAttributes = {
      name: `Fake User ${i}`,
      onboarded: true,
      location: `${locations[i % locations.length].value}`,
      dob: '21.09.2001',
      custom_location: '',
      random: Math.random(),
      email: `fake-user-${i}@example.com`,
      gender: randomGender(),
      denomination: randomDenomination(),
      verified: true,
      clerkId: 'add',
    };

    await ctx.db.insert('users', userAttributes);
  }
});

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    const userAttributes = {
      clerkId: data.id,
      name: '',
      onboarded: false,
      location: '',
      dob: '',
      custom_location: '',
      random: Math.random(),
      email: data.email_addresses[0].email_address,
      gender: '',
      denomination: '',
      verified: false,
    };

    const user = await userByExternalId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert('users', userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);

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
  return await userByExternalId(ctx, identity.subject);
}

async function userByExternalId(ctx: QueryCtx, clerkId: string) {
  return await ctx.db
    .query('users')
    .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
    .unique();
}
