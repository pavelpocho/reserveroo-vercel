import { Place, Reservable, Reservation, ReservationGroup, User } from '@prisma/client';
import { useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime'
import { AccountSummary } from '~/components/profile/account-summary';
import { getUserByUsername } from '~/models/user.server';
import { requireUsernameAndAdmin } from '~/utils/session.server';
import { ProfileLoaderData } from '../profile';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserByUsername({ username: (await requireUsernameAndAdmin(request)).username });
  if (user) {
    user.passwordHash = '';
  }
  return { user: user };
}

export default function ProfileIndex() {

  const { user } = useLoaderData<ProfileLoaderData>();

  return <AccountSummary user={user ?? null} editing={false} />
}