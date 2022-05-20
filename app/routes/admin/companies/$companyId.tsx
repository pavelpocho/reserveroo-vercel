import { Company } from '@prisma/client';
import { Form, useLoaderData } from '@remix-run/react';
import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/server-runtime';
import { useState } from 'react';
import styled from 'styled-components';
import { IdInput } from '~/components/inputs/ObjectInput';
import { TextInput } from '~/components/inputs/TextInput';
import { getCompany, updateCompany } from '~/models/company.server';
import { getFormEssentials } from '~/utils/forms';

interface AdminPlaceDetailLoaderData {
  company: Company;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.companyId) return json({})
  const x = { company: await getCompany({ id: params.companyId }) };
  return json({ company: await getCompany({ id: params.companyId }) });
}

export const action: ActionFunction = async ({ request }) => {

  const { getFormItem, getFormItems } = await getFormEssentials(request);

  const company: Pick<Company, 'id' | 'name'> = {
    id: getFormItem('id'),
    name: getFormItem('name')
  }

  await updateCompany(company);

  return redirect('/admin/companies');

}

const ArrayInputWrap = styled.div`
  display: flex;
`;

export default function AdminCompanyDetail() {

  const { company: defaultPlace } = useLoaderData<AdminPlaceDetailLoaderData>();

  const [ company, setCompany ] = useState<Company>(defaultPlace);

  return (
    <div>
      <p>COMPANY {company.name}</p>
      <Form method='post'>

        <IdInput name='id' value={company?.id} />        
        <TextInput name='name' title='Name' defaultValue={company?.name} />

        <input type='submit'/>
      </Form>
    </div>
  )
}