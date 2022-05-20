import { Company } from '@prisma/client';
import { Outlet, useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';

interface PlacesAdminLoaderData {
  companies: Company[];
}

export const loader: LoaderFunction = async ({ request, params }) => {
  return {}
}

export default function CompaniesAdmin() {

  const { companies } = useLoaderData<PlacesAdminLoaderData>();

  return <>
    <div>COMPANY ADMIN</div>
    <Outlet />
  </>
}