import { ReservableType, MultilingualName } from '@prisma/client';
import { Form, useLoaderData } from '@remix-run/react';
import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/server-runtime';
import { useState } from 'react';
import styled from 'styled-components';
import { IdInput } from '~/components/inputs/ObjectInput';
import { TextInput } from '~/components/inputs/TextInput';
import { useLangs } from '~/contexts/langsContext';
import { getReservableType, updateReservableType } from '~/models/reservableType.server';
import { ReservableTypeWithTexts } from '~/types/types';
import { getFormEssentials } from '~/utils/forms';

interface LoaderData {
  reservableType: ReservableTypeWithTexts | null;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.reservableTypeId) return json({})
  const x = { reservableType: await getReservableType({ id: params.reservableTypeId }) };
  return json({ reservableType: await getReservableType({ id: params.reservableTypeId }) });
}

export const action: ActionFunction = async ({ request }) => {

  const { getFormItem, getFormItems } = await getFormEssentials(request);

  const reservableType: MultilingualName = {
    // this is not the reservableTypeid, dont worry
    id: '-1',
    czech: getFormItem('nameCzech'),
    english: getFormItem('nameEnglish'),
  }

  await updateReservableType({ multiLangName: reservableType, id: getFormItem('id') });

  return redirect('/admin/reservableTypes');

}

const ArrayInputWrap = styled.div`
  display: flex;
`;

export default function AdminReservableTypeDetail() {

  const { reservableType } = useLoaderData<LoaderData>();

  const { lang } = useLangs();

  return (
    <div>
      <p>RESERVABLE TYPE {reservableType?.multiLangName && reservableType?.multiLangName[lang]}</p>
      <Form method='post'>

        <IdInput name='id' value={reservableType?.id ?? ''} />        
        <TextInput name='nameEnglish' title='Name (English)' defaultValue={reservableType?.multiLangName?.english ?? ''} />
        <TextInput name='nameCzech' title='Name (Czech)' defaultValue={reservableType?.multiLangName?.czech ?? ''} />

        <input type='submit'/>
      </Form>
    </div>
  )
}