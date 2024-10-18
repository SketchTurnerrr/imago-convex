/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as conversations from "../conversations.js";
import type * as http from "../http.js";
import type * as likes from "../likes.js";
import type * as matches from "../matches.js";
import type * as messages from "../messages.js";
import type * as myFunctions from "../myFunctions.js";
import type * as profiles from "../profiles.js";
import type * as uploadthing from "../uploadthing.js";
import type * as utils from "../utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  conversations: typeof conversations;
  http: typeof http;
  likes: typeof likes;
  matches: typeof matches;
  messages: typeof messages;
  myFunctions: typeof myFunctions;
  profiles: typeof profiles;
  uploadthing: typeof uploadthing;
  utils: typeof utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
