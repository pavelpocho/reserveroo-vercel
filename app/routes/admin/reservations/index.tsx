import { Company, Reservable, Reservation } from '@prisma/client';
import { useLoaderData, useSubmit } from '@remix-run/react';
import { ActionFunction, json, LoaderFunction } from '@remix-run/server-runtime'
import styled from 'styled-components';
import { AdminReservationGroupSummary } from '~/components/admin/reservation-group-summary';
import { IdInput } from '~/components/inputs/ObjectInput';
import { ReservationGroupSummary } from '~/components/profile/reservation-group-summary';
import { Place } from '~/models/place.server';
import { changeReservationStatus, setStatusOfReservationsInGroup, updateReservation } from '~/models/reservation.server';
import { getReservationGroup, getReservationGroupForConfirmationEmail, getReservationGroupList, ReservationGroup } from '~/models/reservationGroup.server'
import { User } from '~/models/user.server';
import { ReservationStatus } from '~/types/types';
import { sendStatusUpdateEmail } from '~/utils/emails.server';

interface ReservationsAdminLoaderData {
  reservationGroups: (ReservationGroup & {
    user: User | null;
    reservations: (Reservation & {
        reservable: (Reservable & {
            place: (Place & {
              company: Company | null;
            });
        }) | null;
    })[];
  })[]
}


export const loader: LoaderFunction = async () => {
  const reservationGroups = await getReservationGroupList();
  return json({ reservationGroups });
}


export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  // TODO: Validation
  const reservationGroupId = formData.get('rgId')?.toString();
  const status = parseInt(formData.get('status')?.toString() ?? '');

  if (!reservationGroupId || isNaN(status)) {
    // return error message
    return {}
  }

  const reservationGroup = await getReservationGroupForConfirmationEmail({ id: reservationGroupId });
  
  await setStatusOfReservationsInGroup({ reservationGroupId, status });
  if (
    reservationGroup?.reservations[0].reservable?.place && 
    reservationGroup?.user?.email &&
    reservationGroup?.reservations.length > 0 &&
    (status == ReservationStatus.Confirmed || status == ReservationStatus.Rejected)
  ) {
    await sendStatusUpdateEmail(
      reservationGroup?.user?.email,
      status,
      reservationGroup?.reservations[0].reservable?.place,
      reservationGroup.reservations[0].start
    );
  }

  return {}
}

const Title = styled.h4`
  
`;

export default function ReservationAdminList() {

  const { reservationGroups } = useLoaderData<ReservationsAdminLoaderData>();
  const submit = useSubmit();

  const handleChange = (rgId: string, form: HTMLFormElement) => {
    submit(form, { replace: true });
  }

  return <>
    <Title>Reservations</Title>
    { reservationGroups.map(rg => <AdminReservationGroupSummary key={rg.id} reservationGroup={rg} onChangeStatus={(rgId, form) => {
        handleChange(rgId, form);
    }} />) }
  </>
}