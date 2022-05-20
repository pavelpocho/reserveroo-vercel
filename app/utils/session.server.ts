import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { useResolvedPath } from "@remix-run/react";
import { createUser, getUser, checkForUserByUsername, checkForUserByEmail } from "~/models/user.server";
import { checkPassword, generateHashAndSalt } from "./pwd_helper.server";


interface LoginType {
  username: string;
  password: string;
  verifiedEmail?: boolean;
}

type RegisterType = LoginType & {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const login = async ({ username, password }: LoginType) => {

  if (username == '') return null;

  const user = await checkForUserByUsername({ username });

  if (user == null) return null;

  const passwordMatch = await checkPassword(password, user.passwordHash);

  if (!passwordMatch) return null;

  return { userId: user.id, admin: user.admin, verifiedEmail: user.verifiedEmail, email: user.email };

}

export const register = async ({ username, password, email, phone, firstName, lastName }: RegisterType) => {

  if (username == '' || password == '' || email == '' || phone == '' || firstName == '' || lastName == '') return null;

  if (await checkForUserByUsername({ username }) != null || await checkForUserByEmail({ email })) return null;

  const newUser = await createUser({ username, email, phone, firstName, lastName, passwordHash: await generateHashAndSalt(password) });

  return { userId: newUser.id, admin: false } 

}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("You have no session secret, idiot.");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: 'reserveroo-session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

export const createUserSession = async (username: string, admin: boolean = false, verifiedEmail: boolean = false, redirectTo: string) => {
  const session = await storage.getSession();
  if (!verifiedEmail) {
    session.set('usernameToVerify', username);
  }
  else {
    session.set('username', username);
    session.set('usernameToVerify', null);
    session.set('admin', admin);
  }
  return redirect(!verifiedEmail ? '/verifyEmail' : redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session)
    }
  })
}

const getUserSession = (request: Request) => {
  return storage.getSession(request.headers.get('Cookie'));
}

export const requireUsernameAndAdmin = async (
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) => {
  const session = await getUserSession(request);
  const username = session.get('username');
  const admin = session.get('admin');
  const usernameToVerify = session.get('usernameToVerify');
  if (usernameToVerify) {
    const searchParams = new URLSearchParams([
      ['redirectTo', redirectTo]
    ]);
    throw redirect(`/verifyEmail?${searchParams}`);
  }
  if (!username || admin === null || typeof username !== 'string') {
    const searchParams = new URLSearchParams([
      ['redirectTo', redirectTo]
    ]);
    throw redirect(`/authenticate?${searchParams}`);
  } 
  return { username, admin: admin == 'true' || admin == '1' };
}

export const getUsernameAndAdmin = async (
  request: Request
) => {
  const session = await getUserSession(request);
  return { username: session.get('username') as string | null, admin: session.get('admin') as boolean | null, usernameToVerify: session.get('usernameToVerify') };
}

export const requireUsernameToVerify = async (
  request: Request
) => {
  const session = await getUserSession(request);
  const usernameToVerify = session.get('usernameToVerify');
  if (!usernameToVerify) {
    throw redirect(`/authenticate`);
  }
  return { usernameToVerify: usernameToVerify as string };
}

export const logout = async (request: Request, redirectUrl: string) => {
  const session = await getUserSession(request);
  return redirect(redirectUrl, {
    headers: {
      'Set-Cookie': await storage.destroySession(session)
    }
  })
}