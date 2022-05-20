import { ActionFunction, redirect } from '@remix-run/server-runtime'
import { setStatusOfReservationsInGroup } from '~/models/reservation.server';
import { ReservationStatus } from '~/types/types';
import { sendCancellationEmail } from '~/utils/emails.server';
import { getFormEssentials } from '~/utils/forms';

export const action: ActionFunction = async ({ request }) => {

  const { getFormItem } = await getFormEssentials(request);
  const reservationGroupId = getFormItem('rgId');

  await setStatusOfReservationsInGroup({ reservationGroupId, status: ReservationStatus.Cancelled });

  await sendCancellationEmail();
  
  return redirect('/profile');
}

export default function CancelReservation() {
  return (
    <div></div>
  )
}