import { Company, OpeningTime, Place } from '@prisma/client';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/server-runtime';
import { useState } from 'react';
import styled from 'styled-components';
import { IdInput } from '~/components/inputs/ObjectInput';
import { TextInput } from '~/components/inputs/TextInput';
import { getCompanyList } from '~/models/company.server';
import { createOpeningTime } from '~/models/openingTime.server';
import { createPlace } from '~/models/place.server';
import { badRequest, getFormEssentials } from '~/utils/forms';

interface PlaceActionData {
  field?: {
    name: string | null,
    companyId: string | null
  }
}

interface LoaderData {
  companies: Company[]
}

export const loader: LoaderFunction = async ({ request, params }) => {
  return json({ companies: await getCompanyList({ name: '' })});
}

export const action: ActionFunction = async ({ request }) => {

  const { getFormItem } = await getFormEssentials(request);

  const place: Pick<Place, 'name' | 'companyId'> = {
    name: getFormItem('placeName'),
    companyId: getFormItem('companyId')
  }

  if (!place.name) {
    return badRequest<PlaceActionData>({ field: { name: place.name, companyId: place.companyId } });
  }

  const createdPlace = await createPlace(place);

  const openingTimes: Pick<OpeningTime, 'day' | 'open' | 'close' | 'placeId'>[] = [...Array(7).keys()].map(i => ({
    day: i,
    open: new Date(0, 0, 0, 8, 30),
    close: new Date(0, 0, 0, 16, 30),
    placeId: createdPlace.id
  }));

  await Promise.all(openingTimes.sort((a, b) => a.day - b.day).map(o => createOpeningTime(o)));

  return redirect('/admin/places');

}

const ArrayInputWrap = styled.div`
  display: flex;
`;

export default function AdminPlaceDetail() {

  const a = useActionData<PlaceActionData>();
  const { companies } = useLoaderData<LoaderData>();

  const company = { id: '-1', name: a?.field?.name };

  return (
    <div>
      <p>COMPANY {company.name}</p>
      <Form method='post'>

        <TextInput name='placeName' title='Place name' defaultValue={company.name ?? ''} />
        <select name='companyId'>
          { companies.map(c => <option key={c.id} value={c.id} >{c.name}</option>) }
        </select>

        <input type='submit'/>
      </Form>
    </div>
  )
}