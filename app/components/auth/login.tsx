import { Form, Link } from "@remix-run/react";
import { Transition } from "@remix-run/react/transition";
import React from "react";
import styled from "styled-components";
import AnglesRightIcon from "~/assets/icons/AnglesRight";
import { styles } from "~/constants/styles";
import { AuthActionData } from "~/routes/authenticate/login";
import { TextInput } from "../inputs/TextInput";
import { MainButtonBtn } from "../place/place-summary";

export const AuthWrap = styled.div`
  max-width: 500px;
  margin: 0px auto;
  margin-top: 2rem;
  box-sizing: border-box;
  background-color: ${styles.colors.gray[5]};
  padding: 0.75rem;
  @media (min-width: 500px) {
    border-radius: 0.25rem;
  }
`;

export const FieldSet = styled.fieldset`
  border: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SubmitButton = styled.button`
  padding: 0.8rem 0rem;
  border: 1.5px solid ${styles.colors.gray[20]};
  border-radius: 0.4rem;
  background-color: ${styles.colors.white};
  cursor: pointer;
  font-size: 0.9rem;
`;

interface Props {
  a?: AuthActionData,
  searchParams: URLSearchParams,
  setSearchParams: (data: string) => void,
  t: Transition
}

export const LoginComponent: React.FC<Props> = ({ a, searchParams, setSearchParams, t }) => {
  
  React.useEffect(() => {
    if (a?.fields?.redirectTo) {
      setSearchParams(a?.fields?.redirectTo);
    }
  }, [a?.fields?.redirectTo]);

  return (<AuthWrap>
    <Form method='post' action='/authenticate/login'>
      <FieldSet disabled={t.state === 'submitting'}>
        <input hidden={true} name='redirectTo' defaultValue={searchParams.get('redirectTo') ?? undefined} />
        <TextInput name='username' defaultValue={a?.fields?.username ?? ''} title={'Username'} />
        <TextInput password={true} name='password' defaultValue={a?.fields?.password ?? ''} title={'Password'} />
        <Link style={{ color: styles.colors.black }} to='/pwd/forgot'>Forgot password</Link>
        <MainButtonBtn>Sign In<AnglesRightIcon height={'1.5rem'} /></MainButtonBtn>
      </FieldSet>
    </Form>
  </AuthWrap>)
}