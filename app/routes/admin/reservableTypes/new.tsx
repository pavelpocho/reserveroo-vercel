import { Company, MultilingualName } from '@prisma/client';
import { Form, useActionData } from '@remix-run/react';
import { ActionFunction, LoaderFunction, redirect } from '@remix-run/server-runtime';
import styled from 'styled-components';
import { NullLiteral } from 'typescript';
import { IdInput } from '~/components/inputs/ObjectInput';
import { TextInput } from '~/components/inputs/TextInput';
import { createReservableType } from '~/models/reservableType.server';
import { badRequest, getFormEssentials } from '~/utils/forms';

interface ReservableTypeActionData {
  field?: {
    nameCzech: string | null;
    nameEnglish: string | null;
  }
}

export const loader: LoaderFunction = async ({ request, params }) => {
  return {};
}

export const action: ActionFunction = async ({ request }) => {

  const { getFormItem, getFormItems } = await getFormEssentials(request);

  const reservableType: MultilingualName = {
    id: '-1',
    czech: getFormItem('nameCzech'),
    english: getFormItem('nameEnglish'),
  }

  if (!reservableType.english || !reservableType.czech) {
    return badRequest<ReservableTypeActionData>({ field: { nameCzech: reservableType.czech, nameEnglish: reservableType.english } });
  }

  await createReservableType({ multiLangName: reservableType });

  return redirect('/admin/reservableTypes');

}

export default function AdminCompanyDetail() {

  const a = useActionData<ReservableTypeActionData>();

  return (
    <div>
      <p>RESERVABLE TYPE {a?.field?.nameEnglish ?? ''}</p>
      <Form method='post'>

        <IdInput name='id' value={'-1'} />        
        <TextInput name='nameCzech' title='Name (Czech)' defaultValue={a?.field?.nameCzech ?? ''} />
        <TextInput name='nameEnglish' title='Name (English)' defaultValue={a?.field?.nameEnglish ?? ''} />

        <input type='submit'/>
      </Form>
    </div>
  )
}