import { Form, useActionData } from '@remix-run/react'
import { ActionFunction, json, LoaderFunction } from '@remix-run/server-runtime'
import { FaAngleDoubleRight } from 'react-icons/fa'
import styled from 'styled-components'
import { AuthWrap } from '~/components/auth/login'
import { IconRow } from '~/components/icon-row'
import { TextInput } from '~/components/inputs/TextInput'
import { MainButtonBtn } from '~/components/place/place-summary'
import { getEmailFromUsername } from '~/models/user.server'
import { sendPwdResetEmail } from '~/utils/emails.server'
import { badRequest, getBaseUrl, getFormEssentials } from '~/utils/forms'
import { Title } from '../authenticate'
import { Text } from '../verifyEmail'

interface ActionData {
  msg: string;
  fields?: {
    username?: string | null
  }
}

export const action: ActionFunction = async ({ request }) => {
  const { getFormItem } = await getFormEssentials(request);
  const username = getFormItem('username');

  const user = await getEmailFromUsername({ username });

  if (user == null) return badRequest({ msg: "Something went wrong.", fields: { username: username } });

  console.log(user);

  await sendPwdResetEmail(user?.email, getBaseUrl(request), username);

  return json({ msg: "You should get an email with the reset link.", fields: { username: username } });
}

export const loader: LoaderFunction = async ({ request }) => {
  return {};
}

const InputWrap = styled.div`
  padding: 0 1rem;
`;

export default function ForgotPassword() {

  const a = useActionData<ActionData>();

  return <div>
    <Title>Password Reset - Step 1</Title>
    <IconRow invertColors={true} />
    <AuthWrap style={{ paddingBottom: '2rem' }}>
      <Text>Enter your username. If it exists, we will send a password recovery link to the email address paired with your account.</Text>
      <Form method='post'>
        {a?.msg && <p>{a?.msg}</p>}
        <InputWrap>
          <TextInput name='username' title='Username' defaultValue={a?.fields?.username ?? ''} />
        </InputWrap>
        <MainButtonBtn style={{ margin: '1.5rem auto 0' }}>Reset Password<FaAngleDoubleRight /></MainButtonBtn>
      </Form>
    </AuthWrap>
  </div>
}