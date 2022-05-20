import { Outlet } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';

export const loader: LoaderFunction = async ({ request, params }) => {
  return {}
}

export default function TagAdmin() {

  return <>
    <div>LOCATION ADMIN</div>
    <Outlet />
  </>
}