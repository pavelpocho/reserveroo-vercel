import { Category } from '@prisma/client';
import { Outlet, useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';

interface PlacesAdminLoaderData {
  
}

export const loader: LoaderFunction = async ({ request, params }) => {
  return {}
}

export default function CompaniesAdmin() {

  return <>
    <div>CATEGORY ADMIN</div>
    <Outlet />
  </>
}