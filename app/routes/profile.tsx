import { Outlet, useActionData, useLoaderData, useSubmit } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { getUserByUsername } from '~/models/user.server';
import { requireUsernameAndAdmin } from '~/utils/session.server';
import { Place, Reservable, Reservation, ReservationGroup, User } from '@prisma/client';
import { ReservableTypeWithTexts, ReservationStatus } from '~/types/types';
import { ReservationGroupSummary } from '~/components/profile/reservation-group-summary';
import styled from 'styled-components';
import { styles } from '~/constants/styles';

export interface ProfileLoaderData {
  user: User & {
    reservationGroups: (ReservationGroup & {
      reservations: (Reservation & {
        reservable: (Reservable & {
          place: Place,
          ReservableType: ReservableTypeWithTexts
        }) | null;
      })[];
    })[];
  } | null
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserByUsername({ username: (await requireUsernameAndAdmin(request)).username });
  if (user) {
    user.passwordHash = '';
  }
  return { user: user };
}

const ReservationsWrap = styled.div`
  padding: 2rem 0.5rem;
  max-width: 968px;
  margin: 0 auto;
`;

const ReservationsTitle = styled.h4`
  margin-top: 0;
  @media (min-width: 500px) {
    font-size: 1.8rem;
  }
  margin-left: 1rem;
`;

const NoReservations = styled.p`
  margin-left: 1rem;
  font-weight: 500;
`;

export default function Profile() {

  const { user } = useLoaderData<ProfileLoaderData>();
  const submit = useSubmit();

  const cancelRg = (form: HTMLFormElement) => {
    submit(form, { replace: true })
  }

  const reservationGroups = user?.reservationGroups.filter(rg => rg.reservations.length > 0 && !rg.reservations.find(r => r.status == ReservationStatus.Cancelled));

  return (
    <div>
      <Outlet />
      <ReservationsWrap>
        <ReservationsTitle>Your Reservations</ReservationsTitle>
        { reservationGroups?.length == 0 && <NoReservations>You don't have any reservations :'(. Go ahead and make some!</NoReservations> }
        { reservationGroups?.map(rg => <div key={rg.id}>
          <>
            <ReservationGroupSummary onCancel={(rgId, formRef) => {
              setTimeout(() => {
                cancelRg(formRef);
              }, 450);
            }} reservationGroup={rg} />
          </>
        </div>) }
      </ReservationsWrap>
    </div>
  )
}