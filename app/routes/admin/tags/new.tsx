import { MultilingualDesc, MultilingualName, Tag } from '@prisma/client';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { ActionFunction, LoaderFunction, redirect } from '@remix-run/server-runtime';
import { useState } from 'react';
import styled from 'styled-components';
import { IdInput } from '~/components/inputs/ObjectInput';
import { TextInput } from '~/components/inputs/TextInput';
import { createTag } from '~/models/tag.server';
import { badRequest, getFormEssentials } from '~/utils/forms';

interface TagActionData {
  field?: {
    nameCzech: string | null,
    descriptionCzech: string | null,
    nameEnglish: string | null,
    descriptionEnglish: string | null
  }
}

interface TagCreate {
  multiLangName: MultilingualName,
  multiLangDesc: MultilingualDesc,
}

export const loader: LoaderFunction = async ({ request, params }) => {
  return {};
}

export const action: ActionFunction = async ({ request }) => {

  const { getFormItem, getFormItems } = await getFormEssentials(request);

  // const tag: {
  //   id: getFormItem('id'),
  //   name: getFormItem('name'),
  //   description: getFormItem('description'),
  // }

  const tag: TagCreate = {
    multiLangName: {
      id: '-1',
      czech: getFormItem('nameCzech'),
      english: getFormItem('nameEnglish')
    },
    multiLangDesc: {
      id: '-1',
      czech: getFormItem('descriptionCzech'),
      english: getFormItem('descriptionEnglish')
    }
  }

  if (!tag.multiLangName.english || !tag.multiLangName.czech || !tag.multiLangDesc.english || !tag.multiLangDesc.czech) {
    return badRequest<TagActionData>({ field: { nameCzech: tag.multiLangName.czech, nameEnglish: tag.multiLangName.english, descriptionCzech: tag.multiLangDesc.czech, descriptionEnglish: tag.multiLangDesc.english } });
  }

  await createTag(tag);

  return redirect('/admin/tags');

}

const ArrayInputWrap = styled.div`
  display: flex;
`;

export default function AdminTagNew() {

  const a = useActionData<TagActionData>();

  return (
    <div>
      <p>TAG {a?.field?.nameCzech}</p>
      <Form method='post'>

        <IdInput name='id' value={'-1'} />        
        <TextInput name='nameCzech' title='Name (Czech)' defaultValue={a?.field?.nameCzech ?? ''} />
        <TextInput name='nameEnglish' title='Name (English)' defaultValue={a?.field?.nameEnglish ?? ''} />
        <TextInput name='descriptionCzech' title='Description (Czech)' defaultValue={a?.field?.descriptionCzech ?? ''} />
        <TextInput name='descriptionEnglish' title='Description (English)' defaultValue={a?.field?.descriptionEnglish ?? ''} />

        <input type='submit'/>
      </Form>
    </div>
  )
}