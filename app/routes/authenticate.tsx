import { Link, Outlet, useActionData, useSearchParams, useTransition } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/server-runtime'
import React from 'react';
import styled from 'styled-components';
import { LoginComponent } from '~/components/auth/login';
import { RegisterComponent } from '~/components/auth/register';
import { IconRow } from '~/components/icon-row';
import { styles } from '~/constants/styles';
import { useWhereAreWe } from '~/contexts/whereAreWeContext';
import { AuthActionData } from './authenticate/login';

export const loader: LoaderFunction = () => {
  return {}
}

export const Title = styled.h2`
  color: ${styles.colors.black};
  text-align: center;
  font-size: 1.375rem;
  margin: 2rem 0rem 1rem;
  @media (min-width: 500px) {
    font-size: 2rem;
  }
  @media (min-width: 800px) {
    font-size: 2.3rem;
  }
`;

export const TabBar = styled.div`
  margin: 1rem auto;
  width: 95%;
  max-width: 500px;
  justify-content: center;
  align-items: stretch;
  display: flex;
  padding: 0.5rem 0rem;
  border: 1.5px solid ${styles.colors.gray[140]}40;
  border-radius: 0.5rem;
  position: relative;
  overflow: hidden;
`;

export const Separator = styled.div`
  width: 1px;
  background-color: ${styles.colors.gray[50]};
`;

export const AuthTabButton = styled.button`
  width: 50%;
  display: flex;
  background-color: transparent;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.2rem 0;
  margin: 0;
  justify-content: center;
  align-items: center;
  color: ${styles.colors.gray[110]};
  font-weight: bold;
  text-decoration: none;
`;

export const ActiveHighlighter = styled.div<{ position: number }>`
  position: absolute;
  height: calc(100% - 0.4rem);
  border-radius: 0.25rem;
  width: calc(50% - 0.4rem);
  transition: left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  left: ${props => props.position == 0 ? '0px' : '50%'};
  top: 0px;
  margin: 0.2rem;
  background-color: ${styles.colors.action};
  z-index: -1;
`;

export default function Authenticate() {

  const [searchParams, setSearchParams ] = useSearchParams();
  const a = useActionData<AuthActionData>();
  const t = useTransition();

  const redirectTo = encodeURI(searchParams.get('redirectTo') ?? '').replace('/', '%2F');

  const [ position, setPosition ] = React.useState(0);

  const { setSigningIn } = useWhereAreWe();

  React.useEffect(() => {
    setSigningIn(true);
    return () => {
      setSigningIn(false);
    }
  }, []);

  return <>
    <Title>Welcome to Reserveroo.</Title>
    <IconRow invertColors={true} />
    <TabBar>
      <ActiveHighlighter position={position} />
      <AuthTabButton onClick={() => {setPosition(0)}}>Sign In</AuthTabButton>
      <Separator />
      <AuthTabButton onClick={() => {setPosition(1)}}>Create Account</AuthTabButton>
    </TabBar>
    <div>
      { position == 0 && <LoginComponent a={a} searchParams={searchParams} setSearchParams={(data) => { setSearchParams(data) }} t={t} />}
      { position == 1 && <RegisterComponent a={a} searchParams={searchParams} setSearchParams={(data) => { setSearchParams(data) }} t={t} />}
    </div>
  </>
}