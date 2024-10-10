// NOTE: You can remove this file. Declaring the shape
// of the database is entirely optional in Convex.
// See https://docs.convex.dev/database/schemas.

import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema(
  {
    profiles: defineTable({
      clerkId: v.string(),
      name: v.optional(v.string()),

      email: v.string(),
      gender: v.string(),
      denomination: v.string(),
      location: v.string(),
      custom_location: v.string(),
      onboarded: v.boolean(),
      verified: v.boolean(),
    }).index('byClerkId', ['clerkId']),

    prompts: defineTable({
      question: v.string(),
      answer: v.string(),
      profileId: v.id('profiles'),
    }).index('byProfileId', ['profileId']),

    photos: defineTable({
      profileId: v.id('profiles'),
      url: v.string(),
      order: v.number(), // To maintain the order of photos
    }).index('byProfileId', ['profileId']),
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
