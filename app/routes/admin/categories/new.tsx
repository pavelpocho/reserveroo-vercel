import { Company, MultilingualName } from '@prisma/client';
import { Form, useActionData } from '@remix-run/react';
import { ActionFunction, LoaderFunction, redirect } from '@remix-run/server-runtime';
import styled from 'styled-components';
import { NullLiteral } from 'typescript';
import { IdInput } from '~/components/inputs/ObjectInput';
import { TextInput } from '~/components/inputs/TextInput';
import { createCategory } from '~/models/category.server';
import { badRequest, getFormEssentials } from '~/utils/forms';

interface CategoryActionData {
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

  const category: MultilingualName = {
    id: '-1',
    czech: getFormItem('nameCzech'),
    english: getFormItem('nameEnglish'),
  }

  if (!category.english || !category.czech) {
    return badRequest<CategoryActionData>({ field: { nameCzech: category.czech, nameEnglish: category.english } });
  }

  await createCategory({ multiLangName: category });

  return redirect('/admin/categories');

}

const ArrayInputWrap = styled.div`
  display: flex;
`;

export default function AdminCompanyDetail() {

  const a = useActionData<CategoryActionData>();

  return (
    <div>
      <p>CATEGORY {a?.field?.nameEnglish ?? ''}</p>
      <Form method='post'>

        <IdInput name='id' value={'-1'} />        
        <TextInput name='nameCzech' title='Name (Czech)' defaultValue={a?.field?.nameCzech ?? ''} />
        <TextInput name='nameEnglish' title='Name (English)' defaultValue={a?.field?.nameEnglish ?? ''} />

        <input type='submit'/>
      </Form>
    </div>
  )
}