import {
  internalMutation,
  query,
  QueryCtx,
  mutation,
} from './_generated/server';
import { v, Validator } from 'convex/values';
import { queryWithUser } from './utils';
import { locations } from '../lib/constants';
import { getAuthUserId } from '@convex-dev/auth/server';

export const updateUser = mutation({
  args: {
    name: v.optional(v.string()),
    dob: v.optional(v.string()),
    gender: v.optional(v.string()),
    denomination: v.optional(v.string()),
    location: v.optional(v.string()),
    custom_location: v.optional(v.string()),
    random: v.optional(v.float64()),
    onboarded: v.optional(v.boolean()),
    verified: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated!');
    }
    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error('User not found');
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

// export const createProfile = internalMutation({
//   args: {
//     email: v.string(),
//     clerkId: v.string(),
//     name: v.string(),
//   },
//   handler: async (ctx, args) => {
//     await ctx.db.insert('profiles', {
//       clerkId: args.clerkId,
//       name: args.email,
//       email: args.email,
//       gender: 'male',
//       dob: '',
//       denomination: 'other',
//       verified: false,
//       onboarded: false,
//       location: '',
//       custom_location: '',
//       random: Math.random(),
//     });
//   },
// });

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
    };

    await ctx.db.insert('users', userAttributes);
  }
});
