import { Tag } from '@prisma/client';
import { Link, useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { useLangs } from '~/contexts/langsContext';
import { getAllTags } from '~/models/tag.server';
import { TagWithTexts } from '~/types/types';

interface TagsAdminLoaderData {
  tags: TagWithTexts[];
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const tags = await getAllTags();
  return { tags }
}

export default function CompaniesAdminIndex() {

  const { tags } = useLoaderData<TagsAdminLoaderData>();

  const { lang } = useLangs();

  return <>
    <div>
      { tags.map(t => <div key={t.id}>
        <p>Name: {t.multiLangName && t.multiLangName[lang]}</p>
        <p>Description: {t.multiLangDesc && t.multiLangDesc[lang]}</p>
        <Link to={`/admin/tags/${t.id}`}>View / Edit</Link>
      </div>) }
      <Link to={'/admin/tags/new'} >New tag</Link>
    </div>
  </>
}