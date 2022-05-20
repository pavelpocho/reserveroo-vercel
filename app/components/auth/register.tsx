import { Form } from "@remix-run/react"
import { Transition } from "@remix-run/react/transition"
import React, { useState } from "react"
import styled from "styled-components"
import AnglesRightIcon from "~/assets/icons/AnglesRight"
import { styles } from "~/constants/styles"
import { AuthActionData } from "~/routes/authenticate/login"
import { isValidEmail, isValidPhone } from "~/utils/forms"
import { TextInput } from "../inputs/TextInput"
import { MainButtonBtn } from "../place/place-summary"
import { ErrorLabel } from "../profile/account-summary"
import { AuthWrap, FieldSet, SubmitButton } from "./login"

interface Props {
  a?: AuthActionData,
  searchParams: URLSearchParams,
  setSearchParams: (data: string) => void,
  t: Transition
}

export const PwdWarn = styled.p`
  margin: 0;
  color: ${styles.colors.busy};
  font-size: 0.875rem;
`;
export const PwdInfo = styled.p`
  margin: 0;
  color: ${styles.colors.black};
  font-size: 0.875rem;
`;
const ConditionsText = styled.p`
  margin: 0;
  color: ${styles.colors.black};
  font-size: 0.8125rem;
`;

export const Bar = styled.div<{ width: number }>`
  width: ${props => props.width}%;
  height: 6px;
  min-width: 6px;
  border-radius: 3px;
  background-color: ${props => (
    props.width < 25 ? styles.colors.busy : props.width < 50 ? styles.colors.warn :
    props.width < 75 ? styles.colors.primary : styles.colors.free
  )};
`;
export const BarBack = styled.div`
  width: 100%;
  background-color: ${styles.colors.gray[70]};
  height: 6px;
  border-radius: 3px;
`;

const RelativeWrap = styled.div`
  position: relative;
`;

const ItB = (b: boolean) => b ? 1 : 0;

export const checkPasswordStrength = (pwd: string) => {
  const specialChar = /[!-\/]|[:-@]|[\[-`]|[{-~]/.test(pwd);
  const number = /[0-9]/.test(pwd);
  const lowerCase = /[a-z]/.test(pwd);
  const upperCase = /[A-Z]/.test(pwd);
  const length = Math.min(pwd.length, 12) / 2;
  // max is 21
  return ItB(specialChar) * 2 + ItB(number) * 2 + ItB(lowerCase) + ItB(upperCase) + length;
}

export const RegisterComponent: React.FC<Props> = ({ a, searchParams, setSearchParams, t }) => {

  React.useEffect(() => {
    if (a?.fields?.redirectTo) {
      setSearchParams(a?.fields?.redirectTo);
    }
  }, [a?.fields?.redirectTo]);

  const [ pwd, setPwd ] = useState('');
  const [ cpwd, setCPwd ] = useState('');

  const s = Math.max(checkPasswordStrength(pwd), checkPasswordStrength(cpwd));

  const pwdString = (
    s <= 3 ? 'Very weak' : s <= 6 ? 'Weak' : s <= 9 ? 'Moderate' :
    s < 12 ? 'Strong' : 'Very Strong'
  )

  const [ validEmail, setValidEmail ] = useState(true);
  const [ validPhone, setValidPhone ] = useState(true);

  return <AuthWrap>
  <Form method='post' action='/authenticate/register'>
    <FieldSet disabled={t.state === 'submitting'}>
      <input hidden={true} name='redirectTo' defaultValue={searchParams.get('redirectTo') ?? undefined} />
      <TextInput title={'Username'} name='username' defaultValue={a?.fields?.username ?? ''} />
      <TextInput setValue={setPwd} title={'Password'} password={true} name='password' defaultValue={a?.fields?.password ?? ''} />
      <TextInput setValue={setCPwd} title={'Confirm Password'} password={true} name='confirmPassword' defaultValue={a?.fields?.password ?? ''} />
      <BarBack><Bar width={s / 12 * 100}></Bar></BarBack>
      { s > 0 && pwd == cpwd && <PwdInfo>Your password is <strong>{pwdString}</strong></PwdInfo> }
      { pwd.length == 0 && cpwd.length == 0 && <PwdInfo>Choose a strong password.</PwdInfo> }
      { pwd != cpwd && <PwdWarn>Your passwords don't match.</PwdWarn> }
      <TextInput title={'First Name'} name='firstName' defaultValue={a?.fields?.firstName ?? ''} />
      <TextInput title={'Last Name'} name='lastName' defaultValue={a?.fields?.lastName ?? ''} />
      <RelativeWrap>
        <TextInput setValue={(s) => {setValidEmail(isValidEmail(s))}} title={'Email'} name='email' defaultValue={a?.fields?.email ?? ''} />
        { !validEmail && <ErrorLabel>Invalid email</ErrorLabel> }
      </RelativeWrap>
      <RelativeWrap>
        <TextInput setValue={(s) => {setValidPhone(isValidPhone(s))}} title={'Phone Number'} name='phone' defaultValue={a?.fields?.phone ?? ''} />
        { !validPhone && <ErrorLabel>Invalid phone</ErrorLabel> }
      </RelativeWrap>
      <ConditionsText>By creating an account, you agree with us sending you necessary email corespondence. (Password resets, confirmation emails, etc.)</ConditionsText>
      <ConditionsText>Your details (name, email, phone) may be shared with those places where you make reservations.</ConditionsText>
      <MainButtonBtn disabled={!validEmail || !validPhone} onClick={(e) => {
        if (!validEmail || !validPhone) {
          e.preventDefault();
        }
      }}>Create Account<AnglesRightIcon height={'1.5rem'} /></MainButtonBtn>
      { a && a.formError && <p>
        {a.formError}
      </p> }
    </FieldSet>
  </Form>
</AuthWrap>
}