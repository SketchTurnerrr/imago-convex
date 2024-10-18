import { httpRouter } from 'convex/server';
import { auth } from './auth';
import { Webhook } from 'svix';

const http = httpRouter();

auth.addHttpRoutes(http);

export default http;
