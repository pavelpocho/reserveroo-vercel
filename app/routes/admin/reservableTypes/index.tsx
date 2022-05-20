import { ReservableType } from '@prisma/client';
import { Link, useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { useLangs } from '~/contexts/langsContext';
import { getReservableTypeList } from '~/models/reservableType.server';
import { ReservableTypeWithTexts } from '~/types/types';

interface LoaderData {
  categories: ReservableTypeWithTexts[];
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const categories = await getReservableTypeList({ nameFragment: params.reservableTypeId ?? '' });
  return { categories }
}

export default function CategoriesAdminIndex() {

  const { categories } = useLoaderData<LoaderData>();

  const { lang } = useLangs();

  return <>
    <div>
      { categories.map(c => <div key={c.id}>
        <p>Name: {c.multiLangName && c.multiLangName[lang]}</p>
        <Link to={`/admin/reservableTypes/${c.id}`}>View / Edit</Link>
      </div>) }
      <Link to={'/admin/reservableTypes/new'} >New reservable type</Link>
    </div>
  </>
}