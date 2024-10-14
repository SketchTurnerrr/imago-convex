// NOTE: You can remove this file. Declaring the shape
// of the database is entirely optional in Convex.
// See https://docs.convex.dev/database/schemas.

import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema(
  {
    profiles: defineTable({
      clerkId: v.string(),
      name: v.string(),
      dob: v.string(),
      email: v.string(),
      gender: v.string(),
      denomination: v.string(),
      location: v.string(),
      custom_location: v.string(),
      random: v.float64(),
      onboarded: v.boolean(),
      verified: v.boolean(),
    })
      .index('by_rand', ['random'])
      .index('by_clerkId', ['clerkId']),

    prompts: defineTable({
      question: v.string(),
      answer: v.string(),
      profileId: v.id('profiles'),
    }).index('by_profileId', ['profileId']),

    photos: defineTable({
      profileId: v.id('profiles'),
      url: v.string(),
      order: v.number(), // To maintain the order of photos
    }).index('by_profileId', ['profileId']),

    likes: defineTable({
      likerId: v.id('profiles'),
      likedProfileId: v.id('profiles'),
      itemId: v.union(v.id('photos'), v.id('prompts')),
      itemType: v.union(v.literal('photo'), v.literal('prompt')),
      comment: v.optional(v.string()),
    })
      .index('by_liker', ['likerId'])
      .index('by_liked_profile', ['likedProfileId'])
      .index('by_item', ['itemId'])
      .index('by_liker_and_item', ['likerId', 'itemId']),
  },
  // If you ever get an error about schema mismatch
  // between your data and your schema, and you cannot
  // change the schema to match the current data in your database,
  // you can:
  //  1. Use the dashboard to delete tables or individual documents
  //     that are causing the error.
  //  2. Change this option to `false` and make changes to the data
  //     freely, ignoring the schema. Don't forget to change back to `true`!
  { schemaValidation: true }
);
