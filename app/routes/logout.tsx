import type { ActionFunction } from '@remix-run/server-runtime'
import { logout } from '~/utils/session.server';

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const redirectUrl = form.get('redirectUrl')?.toString();

  return logout(request, redirectUrl ?? '/');
}

export default function Logout() {
  return (
    <></>
  )
}