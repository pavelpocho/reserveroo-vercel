import { Link, NavLink, Outlet, useLoaderData } from '@remix-run/react'
import { json, LoaderFunction } from '@remix-run/server-runtime'
import styled from 'styled-components';
import { styles } from '~/constants/styles';
import { UnstyledLink } from '~/root';
// import { LinkWithLoader } from '~/components/LinkWithLoader';
import { requireUsernameAndAdmin } from '~/utils/session.server'

interface AdminLoaderData {
  forbidden: boolean
}

const forbidden = (data: AdminLoaderData) => json(data, { status: 403 });

export const loader: LoaderFunction = async ({ request }) => {
  const { admin } = await requireUsernameAndAdmin(request);
  if (admin === true) {
    return {}
  }
  return forbidden({ forbidden: true });
}

const AdminHeader = styled.div`
  background-color: ${styles.colors.gray[10]};
  display: flex;
  gap: 2rem;
`;

const TabButton = styled(UnstyledLink)`
  color: ${styles.colors.black};
  display: block;
  padding: 1rem 1.5rem;
  font-size: 1.2rem;
`;

export default function Admin() {
  return useLoaderData<AdminLoaderData>().forbidden ? 
    <div>Iiii dont think ur an admin m8</div> : <>
    <AdminHeader>
      <TabButton to='/admin/reservations'>Reservations</TabButton>
      <TabButton to='/admin/places'>Places</TabButton>
      <TabButton to='/admin/companies'>Companies</TabButton>
      <TabButton to='/admin/tags'>Tags</TabButton>
      <TabButton to='/admin/categories'>Categories</TabButton>
      <TabButton to='/admin/locations'>Locations</TabButton>
      <TabButton to='/admin/reservableTypes'>Reservable types</TabButton>
    </AdminHeader>
    <div>
      <Outlet />
    </div>
  </>
}