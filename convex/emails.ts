import { ConvexError, v } from 'convex/values';
import { Resend } from 'resend';
import { action } from './_generated/server';

import SignUpMagicLinkEmail from './templates/signupEmail';
import SignInMagicLinkEmail from './templates/signinEmail';

export const sendSignUpEmailAction = action({
  args: {
    email: v.string(),
    link: v.optional(v.union(v.string(), v.null())),
  },
  async handler(_, { email, link }) {
    try {
      await sendSignUpEmail({ email, link });
    } catch (error) {
      throw error;
    }
  },
});

export const sendSignInEmailAction = action({
  args: {
    email: v.string(),
    link: v.optional(v.union(v.string(), v.null())),
  },
  async handler(_, { email, link }) {
    try {
      await sendSignInEmail({ email, link });
    } catch (error) {
      throw error;
    }
  },
});

async function sendSignUpEmail({
  email,
  link,
}: {
  email: string;
  link: string | null | undefined;
}) {
  if (process.env.AUTH_RESEND_KEY === undefined) {
    console.error(
      'Set up `RESEND_API_KEY` and `HOSTED_URL` to send invite emails'
    );
    return;
  }

  const resend = new Resend(process.env.AUTH_RESEND_KEY);
  const { error } = await resend.emails.send({
    from: 'no-reply@imagodateua.com',
    to: [email],
    subject: 'Створення акаунту Імаго',
    react: SignUpMagicLinkEmail({ magicLink: link }),
  });

  if (error) {
    console.log('error :', error);
    throw new ConvexError('Could not send invitation email');
  }
}

async function sendSignInEmail({
  email,
  link,
}: {
  email: string;
  link: string | null | undefined;
}) {
  if (process.env.AUTH_RESEND_KEY === undefined) {
    console.error(
      'Set up `RESEND_API_KEY` and `HOSTED_URL` to send invite emails'
    );
    return;
  }

  const resend = new Resend(process.env.AUTH_RESEND_KEY);
  const { error } = await resend.emails.send({
    from: 'no-reply@imagodateua.com',
    to: [email],
    subject: 'Вхід в Імаго',
    react: SignInMagicLinkEmail({ magicLink: link }),
  });

  if (error) {
    console.log('error :', error);
    throw new ConvexError('Could not send invitation email');
  }
}
