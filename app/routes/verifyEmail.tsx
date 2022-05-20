import { Form, useActionData, useLoaderData, useSearchParams, useSubmit } from '@remix-run/react'
import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/server-runtime'
import React from 'react'
import { FaAngleDoubleRight } from 'react-icons/fa'
import styled from 'styled-components'
import { AuthWrap } from '~/components/auth/login'
import { IconRow } from '~/components/icon-row'
import { IdInput } from '~/components/inputs/ObjectInput'
import { MainButtonBtn } from '~/components/place/place-summary'
import { getUserByUsername, getUserEmailToResend, verifyUserEmail } from '~/models/user.server'
import { sendEmailConfirmationEmail } from '~/utils/emails.server'
import { badRequest, getBaseUrl, getFormEssentials } from '~/utils/forms'
import { createUserSession, requireUsernameToVerify } from '~/utils/session.server'
import { verifyMessage } from '~/utils/signing.server'
import { Title } from './authenticate'

interface LoaderData {
  usernameToVerify: string
};

interface ActionData {
  msg: string
}

export const loader: LoaderFunction = async ({ request }) => {
  const { usernameToVerify } = await requireUsernameToVerify(request);
  return json({ usernameToVerify });
}

export const action: ActionFunction = async ({ request }) => {
  const { getFormItem } = await getFormEssentials(request);
  const usernameToVerify = getFormItem('usernameToVerify');
  const user = await getUserEmailToResend({ username: usernameToVerify });
  const token = getFormItem('token');

  if (token) {
    const goodEmail = verifyMessage(token.split(':')[0], token.split(':')[1]);
    if (!goodEmail) {
      return badRequest({ msg: "Email verification failed." });
    }
    const user = await verifyUserEmail(token.split(':')[0]);
    return createUserSession(user.username, user.admin, true, '/doneVerifyingEmail');
  }
  else if (!!usernameToVerify && !!user && user.verifyEmailTriesLeft > 0) {
    const baseUrl = getBaseUrl(request);
    await sendEmailConfirmationEmail(user.email, baseUrl);
    return json({ msg: "Another email sent." });
  }
  else {
    return badRequest({ msg: "Looks like you're out of verification emails." });
  }
}

const Header = styled.h5`
  font-weight: 600;
  padding: 0 1rem;
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
`;

export const Text = styled.p<{ bottom?: boolean }>`
  font-weight: 500;
  padding: 0 1rem;
  margin-bottom: ${props => props.bottom ? '2rem' : ''};
  font-size: 0.875rem;
`;

export default function ComponentName() {

  const [s] = useSearchParams();
  const token = s.get('verifyToken');
  const submit = useSubmit();
  const { usernameToVerify } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const formRef = React.useRef<HTMLFormElement>(null);

  const [ countDown, setCountDown ] = React.useState(30);
  console.log(countDown);

  React.useEffect(() => {
    if (formRef.current) {
      submit(formRef.current);
    }
    const timerId = setInterval(() => {
      if ((!token || token == '')) {
        setCountDown(countDown => countDown > 0 ? countDown - 1 : countDown);
      }
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  return <>
    {!token || token == '' ? <>
      <Title>Email Verification - Step 1</Title>
      <IconRow invertColors={true} />
      <AuthWrap style={{ paddingBottom: '2rem' }}>
        <Header>Please confirm your email address.</Header>
        <Text>To use your account, you must confirm your email address by clicking a link we sent you there.</Text>
        <Text bottom={true}>Didn't receive anything? Check your spam folder. Or... ({countDown.toString()}s)</Text>
        <Form method='post'>
          <IdInput name='usernameToVerify' value={usernameToVerify} />
          <MainButtonBtn style={{ margin: '0 auto' }} disabled={countDown > 0} onClick={() => {
            setCountDown(30);
          }}>Resend Email<FaAngleDoubleRight /></MainButtonBtn>
        </Form>
      </AuthWrap>
      { actionData?.msg && <p>{actionData.msg}</p> }
    </> : <>
      <Title>Email Verification - Step 2</Title>
      <IconRow invertColors={true} />
      <AuthWrap>
        <Header>Confirming your email address...</Header>
        <Text bottom={true}>You will be redirected to Reserveroo in a moment.</Text>
        <Form method='post' ref={formRef}>
          <IdInput name='token' value={token} />
        </Form>
      </AuthWrap>
    </>}
  </>
}