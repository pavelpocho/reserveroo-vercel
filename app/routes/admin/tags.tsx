import { Tag } from '@prisma/client';
import { Outlet } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';

interface PlacesAdminLoaderData {
  tags: Tag[];
}

export const loader: LoaderFunction = async ({ request, params }) => {
  return {}
}

export default function TagAdmin() {

  return <>
    <div>TAG ADMIN</div>
    <Outlet />
  </>
}