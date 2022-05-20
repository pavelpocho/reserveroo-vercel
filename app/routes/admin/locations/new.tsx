import { Location, MultilingualDesc, MultilingualName } from '@prisma/client';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { ActionFunction, LoaderFunction, redirect } from '@remix-run/server-runtime';
import { useState } from 'react';
import styled from 'styled-components';
import { IdInput } from '~/components/inputs/ObjectInput';
import { TextInput } from '~/components/inputs/TextInput';
import { createLocation } from '~/models/location.server';
import { badRequest, getFormEssentials } from '~/utils/forms';

interface LocationActionData {
  field?: {
    cityCzech: string | null,
    countryCzech: string | null,
    cityEnglish: string | null,
    countryEnglish: string | null
  }
}

interface LocationToCreate {
  multiLangCity: MultilingualDesc,
  multiLangCountry: MultilingualName,
}

export const loader: LoaderFunction = async ({ request, params }) => {
  return {};
}

export const action: ActionFunction = async ({ request }) => {

  const { getFormItem, getFormItems } = await getFormEssentials(request);

  const location: LocationToCreate = {
    multiLangCity: {
      id: '-1',
      czech: getFormItem('cityCzech'),
      english: getFormItem('cityEnglish'),
    },
    multiLangCountry: {
      id: '-1',
      czech: getFormItem('countryCzech'),
      english: getFormItem('countryEnglish'),
    }
  }

  if (!location.multiLangCity.czech || !location.multiLangCity.english || !location.multiLangCountry.czech || !location.multiLangCountry.english) {
    return badRequest<LocationActionData>({ field: {
      cityCzech: location.multiLangCity.czech,
      countryCzech: location.multiLangCountry.czech,
      cityEnglish: location.multiLangCity.english,
      countryEnglish: location.multiLangCountry.english, 
    } });
  }

  await createLocation(location);

  return redirect('/admin/locations');

}

const ArrayInputWrap = styled.div`
  display: flex;
`;

export default function AdminLocationNew() {

  const a = useActionData<LocationActionData>();

  return (
    <div>
      <p>TAG {a?.field?.cityEnglish}</p>
      <Form method='post'>

        <IdInput name='id' value={'-1'} />        
        <TextInput name='cityCzech' title='City (Czech)' defaultValue={a?.field?.cityCzech ?? ''} />
        <TextInput name='countryCzech' title='Country (Czech)' defaultValue={a?.field?.countryCzech ?? ''} />
        <TextInput name='cityEnglish' title='City (English)' defaultValue={a?.field?.cityEnglish ?? ''} />
        <TextInput name='countryEnglish' title='Country (English)' defaultValue={a?.field?.countryEnglish ?? ''} />

        <input type='submit'/>
      </Form>
    </div>
  )
}