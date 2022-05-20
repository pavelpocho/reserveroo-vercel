import { Location, MultilingualDesc, MultilingualName } from '@prisma/client';
import { Form, useLoaderData } from '@remix-run/react';
import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/server-runtime';
import { useState } from 'react';
import styled from 'styled-components';
import { IdInput } from '~/components/inputs/ObjectInput';
import { TextInput } from '~/components/inputs/TextInput';
import { useLangs } from '~/contexts/langsContext';
import { getLocation, updateLocation } from '~/models/location.server';
import { LocationWithTexts } from '~/types/types';
import { getFormEssentials } from '~/utils/forms';

interface AdminLocationDetailLoaderData {
  location: LocationWithTexts | null;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.locationId) return json({})
  return json({ location: await getLocation({ id: params.locationId }) });
}

export const action: ActionFunction = async ({ request }) => {

  const { getFormItem, getFormItems } = await getFormEssentials(request);

  const location: Pick<Location, 'id'> & {
    multiLangCountry: MultilingualName
    multiLangCity: MultilingualDesc
  } = {
    id: getFormItem('id'),
    multiLangCity: {
      id: '-1',
      czech: getFormItem('cityCzech'),
      english: getFormItem('cityEnglish'),
    },
    multiLangCountry: {
      id: '-1',
      czech: getFormItem('countryCzech'),
      english: getFormItem('countryEnglish'),
    },
  }

  console.log("just before update");
  console.log(location)
  await updateLocation(location);

  return redirect('/admin/locations');

}

const ArrayInputWrap = styled.div`
  display: flex;
`;

export default function AdminLocationDetail() {

  const { location } = useLoaderData<AdminLocationDetailLoaderData>();

  const { lang } = useLangs();

  return (
    location && <div>
      <p>LOCATION: {location?.multiLangCity && location?.multiLangCity[lang]} in {location?.multiLangCountry && location?.multiLangCountry[lang]}</p>
      <Form method='post'>

        <IdInput name='id' value={location?.id} />        
        <TextInput name='cityCzech' title='City (Czech)' defaultValue={location?.multiLangCity?.czech ?? ''} />
        <TextInput name='countryCzech' title='Country (Czech)' defaultValue={location?.multiLangCountry?.czech ?? ''} />
        <TextInput name='cityEnglish' title='City (English)' defaultValue={location?.multiLangCity?.english ?? ''} />
        <TextInput name='countryEnglish' title='Country (English)' defaultValue={location?.multiLangCountry?.english ?? ''} />

        <input type='submit'/>
      </Form>
    </div>
  )
}