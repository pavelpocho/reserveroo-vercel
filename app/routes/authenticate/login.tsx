import { Form, Link, useActionData, useSearchParams, useSubmit, useTransition } from '@remix-run/react';
import { ActionFunction, json } from '@remix-run/server-runtime';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '~/components/button';
import { IdInput } from '~/components/inputs/ObjectInput';
import { TextInput } from '~/components/inputs/TextInput';
import { styles } from '~/constants/styles';
import { sendEmailConfirmationEmail } from '~/utils/emails.server';
import { badRequest, getBaseUrl } from '~/utils/forms';
import { createUserSession, login } from '~/utils/session.server';
import { signMessage } from '~/utils/signing.server';

export type AuthActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
  };
  fields?: {
    username: string;
    password: string;
    redirectTo: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const username = form.get('username')?.toString();
  const password = form.get('password')?.toString();

  const baseUrl = getBaseUrl(request);

  // Should validate this
  const redirectTo = form.get('redirectTo')?.toString();

  const { userId, admin, verifiedEmail, email } = await login({
    username: username ?? '',
    password: password ?? ''
  }) ?? { userId: null, admin: false };

  if (userId == null || username == null) {
    return badRequest({
      fields: { username: username ?? '', password: password ?? '', redirectTo: redirectTo ?? '' },
      formError: 'Something is wrong.'
    });
  }

  if (!verifiedEmail) {
    await sendEmailConfirmationEmail(email, baseUrl);
  }

  return createUserSession(username, admin, verifiedEmail, redirectTo ?? '/');
}