import { Form, useActionData, useLoaderData, useSearchParams, useSubmit } from '@remix-run/react'
import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/server-runtime'
import React from 'react'
import { IdInput } from '~/components/inputs/ObjectInput'
import { getUserByUsername, getUserEmailToResend, verifyUserEmail } from '~/models/user.server'
import { sendEmailConfirmationEmail } from '~/utils/emails.server'
import { badRequest, getBaseUrl, getFormEssentials } from '~/utils/forms'
import { createUserSession, requireUsernameToVerify } from '~/utils/session.server'
import { verifyMessage } from '~/utils/signing.server'

interface LoaderData {
  usernameToVerify: string
};

interface ActionData {
  msg: string
}

export const loader: LoaderFunction = async ({ request }) => {
  const usernameToVerify = await requireUsernameToVerify(request);
  return json({ usernameToVerify });
}

export const action: ActionFunction = async ({ request }) => {
  return redirect('/');
}

export default function ComponentName() {

  const submit = useSubmit();
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (formRef.current) {
      submit(formRef.current);
    }
  }, [formRef.current]);

  return <div>
    <p>Signing you in...</p>
    <Form method='post'>
      <IdInput name='nothing' value={''} />
    </Form>
  </div>
}