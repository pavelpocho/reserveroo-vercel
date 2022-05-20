import { Form, useActionData, useSearchParams, useTransition } from '@remix-run/react';
import { ActionFunction, json } from '@remix-run/server-runtime';
import React from 'react';
import { TextInput } from '~/components/inputs/TextInput';
import { sendEmailConfirmationEmail } from '~/utils/emails.server';
import { getBaseUrl, getFormEssentials } from '~/utils/forms';
import { createUserSession, login, register } from '~/utils/session.server';
import { AuthActionData } from './login';

const badRequest = (data: AuthActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  
  const { getFormItem } = await getFormEssentials(request);

  // Should validate this
  const redirectTo = getFormItem('redirectTo');
  const username = getFormItem('username');
  const password = getFormItem('password');
  const phone = getFormItem('phone');
  const email = getFormItem('email');
  const firstName = getFormItem('firstName');
  const lastName = getFormItem('lastName');

  const { userId, admin } = await register({
    username,
    password,
    phone,
    email,
    firstName,
    lastName,
  }) ?? { userId: null, admin: false };

  if (userId == null || username == null) {
    return badRequest({
      fields: { username: username ?? '', password: password ?? '', redirectTo: redirectTo ?? '' },
      formError: 'Something is wrong.'
    });
  }

  const baseUrl = getBaseUrl(request);

  await sendEmailConfirmationEmail(email, baseUrl);

  return createUserSession(username, admin, false, '/verifyEmail');
}