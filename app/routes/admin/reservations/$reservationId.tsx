import { OpeningTime, Place, Reservable, Reservation, ReservationGroup } from '@prisma/client';
import { Form, useActionData, useLoaderData, useParams } from '@remix-run/react';
import { ActionFunction, LoaderFunction, redirect } from '@remix-run/server-runtime'
import React from 'react';
import styled from 'styled-components';
import { DateInput } from '~/components/inputs/DateInput';
import { IdInput } from '~/components/inputs/ObjectInput';
import { TextInput } from '~/components/inputs/TextInput';
import { ReservableTimes } from '~/components/reservable-times';
import { createReservation, deleteReservation, updateReservation } from '~/models/reservation.server';
import { getReservationGroup, updateReservationGroup } from '~/models/reservationGroup.server';
import { ReservableWithReservations, ReservationGroupForEdit } from '~/types/types';
import { badRequest, getDayOfWeek } from '~/utils/forms';

interface LoaderData {
  reservationGroup: ReservationGroupForEdit
}

export type ReserveActionData = {
  formError?: string;
  fields?: {
    note: string;
    userId: string;
    placeId: string;
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  
  // yes this is correct, just want to keep the file structure
  // consistent and the address bar should say 'reservations',
  // not 'reservationGroups'
  // | | |
  // v v v
  const reservationGroupId = params.reservationId;
  const rGroup = await getReservationGroup({ id: reservationGroupId ?? '' });

  return { reservationGroup: rGroup };
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const note = form.get('note')?.toString();
  const placeId = form.get('placeId')?.toString();
  const userId = form.get('userId')?.toString();
  const rgId = form.get('rgId')?.toString();

  const reservableId = form.getAll('reservableId[]').map(r => r.toString());
  const reservationId = form.getAll('reservationId[]').map(r => r.toString());
  const reservationBackup = form.getAll('reservationBackup[]').map(r => r.toString());
  const dateTimeStart = form.getAll('start[]').map(r => r.toString());
  const dateTimeEnd = form.getAll('end[]').map(r => r.toString());

  // You need to repeat the validation here!!!!!!

  if (!dateTimeEnd || !dateTimeStart || !note || !placeId || !userId || !reservableId || note == '') {
    return badRequest({
      fields: {
        note: note ?? '', placeId: placeId ?? '', userId: userId ?? ''
      },
      formError: 'Fill everything in pls.'
    })
  }

  const resGroup = await updateReservationGroup({ id: rgId ?? '', note, userId });
  const promises: Promise<object>[] = []
  dateTimeStart.forEach((d, i) => {
    if (reservationId[i] == '-1') {
      promises.push(createReservation({ backup: reservationBackup[i] == '1', start: new Date(dateTimeStart[i]), end: new Date(dateTimeEnd[i]), reservableId: reservableId[i] ?? null, reservationGroupId: resGroup.id ?? null }));
    }
    else {
      promises.push(updateReservation({ id: reservationId[i], backup: reservationBackup[i] == '1',  start: new Date(dateTimeStart[i]), end: new Date(dateTimeEnd[i]), reservableId: reservableId[i] ?? null, reservationGroupId: resGroup.id ?? null }));
    }
  });
  // These reservationId(s) only get sent when a time is selected
  // So if our resGroup has ids, which are not here,
  // they need to be deleted
  resGroup.reservations.map(r => r.id).forEach(id => {
    if (!reservationId.includes(id)) {
      promises.push(deleteReservation({ id }));
    }
  })
  await Promise.all(promises);

  // Here you can return actionData instead to show a confirmation dialog and then
  // redirect to the details from there or something
  return redirect(`/admin/reservations`);
}

const getDiffBetweenTwoDates = (close: string | Date, open: string | Date) => {
  const millis = new Date(close).getTime() - new Date(open).getTime();
  return millis / 1000 / 60;
}

const Title = styled.h4`
  
`;

export default function EditReservation() {

  const { reservationGroup } = useLoaderData<LoaderData>();
  const place = reservationGroup?.reservations && reservationGroup.reservations.length > 0 ? reservationGroup?.reservations[0].reservable?.place : null;

  const actionData = useActionData<ReserveActionData>();

  const [ date, setDate ] = React.useState<Date | null>(null);

  return reservationGroup?.userId && place && <Form method='post'>
    <Title>Edit reservation</Title>
    <IdInput name={'userId'} value={reservationGroup.userId} /> 
    <IdInput name={'placeId'} value={place.id} />
    <IdInput name={'rgId'} value={reservationGroup.id} />
    <TextInput name={'note'} title={'Note'} defaultValue={reservationGroup.note} />
    <DateInput name={'date'} defaultValue={date} title={'Date'} onChange={setDate} />
    { date && place?.reservables && <ReservableTimes
      reservationBackupName={'reservationBackup[]'}
      reservables={place.reservables}
      date={date}
      openingTime={place.openingTimes.sort((a, b) => a.day - b.day)[getDayOfWeek(date)]}
      startName={'start[]'}
      endName={'end[]'}
      reservableIdName={'reservableId[]'}
      defaultReservationGroup={reservationGroup}
      reservationIdName={'reservationId[]'}
    /> }
    <p>Backup timeslots (if any):</p>
    { date && place?.reservables && <ReservableTimes
      reservationBackupName={'reservationBackup[]'}
      backup={true}
      reservables={place.reservables}
      date={date}
      openingTime={place.openingTimes.sort((a, b) => a.day - b.day)[getDayOfWeek(date)]}
      startName={'start[]'}
      endName={'end[]'}
      reservableIdName={'reservableId[]'}
      defaultReservationGroup={reservationGroup}
      reservationIdName={'reservationId[]'}
    /> }
    {
      actionData?.formError && <p>{actionData.formError ?? ''}</p>
    }
    <input type='submit' />
  </Form>
}