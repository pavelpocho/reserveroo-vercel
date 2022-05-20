import { Company } from '@prisma/client';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { ActionFunction, LoaderFunction, redirect } from '@remix-run/server-runtime';
import { useState } from 'react';
import styled from 'styled-components';
import { IdInput } from '~/components/inputs/ObjectInput';
import { TextInput } from '~/components/inputs/TextInput';
import { createCompany } from '~/models/company.server';
import { badRequest, getFormEssentials } from '~/utils/forms';

interface CompanyActionData {
  field?: {
    name: string | null
  }
}

export const loader: LoaderFunction = async ({ request, params }) => {
  return {};
}

export const action: ActionFunction = async ({ request }) => {

  const { getFormItem, getFormItems } = await getFormEssentials(request);

  const company: Pick<Company, 'id' | 'name'> = {
    id: getFormItem('id'),
    name: getFormItem('name')
  }

  if (!company.id || !company.name) {
    return badRequest<CompanyActionData>({ field: { name: company.name } });
  }

  await createCompany(company);

  return redirect('/admin/companies');

}

const ArrayInputWrap = styled.div`
  display: flex;
`;

export default function AdminCompanyDetail() {

  const a = useActionData<CompanyActionData>();

  const company = { id: '-1', name: a?.field?.name };

  return (
    <div>
      <p>COMPANY {company.name}</p>
      <Form method='post'>

        <IdInput name='id' value={'-1'} />        
        <TextInput name='name' title='Name' defaultValue={company.name ?? ''} />

        <input type='submit'/>
      </Form>
    </div>
  )
}