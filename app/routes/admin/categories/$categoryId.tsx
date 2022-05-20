import { Category, MultilingualName } from '@prisma/client';
import { Form, useLoaderData } from '@remix-run/react';
import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/server-runtime';
import { useState } from 'react';
import styled from 'styled-components';
import { IdInput } from '~/components/inputs/ObjectInput';
import { TextInput } from '~/components/inputs/TextInput';
import { useLangs } from '~/contexts/langsContext';
import { getCategory, updateCategory } from '~/models/category.server';
import { CategoryWithTexts } from '~/types/types';
import { getFormEssentials } from '~/utils/forms';

interface AdminPlaceDetailLoaderData {
  category: CategoryWithTexts | null;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.categoryId) return json({})
  const x = { category: await getCategory({ id: params.categoryId }) };
  return json({ category: await getCategory({ id: params.categoryId }) });
}

export const action: ActionFunction = async ({ request }) => {

  const { getFormItem, getFormItems } = await getFormEssentials(request);

  const category: MultilingualName = {
    // this is not the categoryid, dont worry
    id: '-1',
    czech: getFormItem('nameCzech'),
    english: getFormItem('nameEnglish'),
  }

  await updateCategory({ multiLangName: category, id: getFormItem('id') });

  return redirect('/admin/categories');

}

const ArrayInputWrap = styled.div`
  display: flex;
`;

export default function AdminCategoryDetail() {

  const { category } = useLoaderData<AdminPlaceDetailLoaderData>();

  const { lang } = useLangs();

  return (
    <div>
      <p>CATEGORY {category?.multiLangName && category?.multiLangName[lang]}</p>
      <Form method='post'>

        <IdInput name='id' value={category?.id ?? ''} />        
        <TextInput name='nameEnglish' title='Name (English)' defaultValue={category?.multiLangName?.english ?? ''} />
        <TextInput name='nameCzech' title='Name (Czech)' defaultValue={category?.multiLangName?.czech ?? ''} />

        <input type='submit'/>
      </Form>
    </div>
  )
}