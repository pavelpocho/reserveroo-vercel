import { Company, Reservable } from '@prisma/client';
import { Link, useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { getAllPlaces, Place } from '~/models/place.server';

interface PlacesAdminLoaderData {
  places: (Place & {
    reservables: Reservable[];
    company: Company | null;
})[]
}

export const loader: LoaderFunction = async () => {
  const places = await getAllPlaces();
  return { places }
}

export default function PlacesAdminIndex() {

  const { places } = useLoaderData<PlacesAdminLoaderData>();

  return <>
    <div>
      { places.map(p => <div key={p.id}>
        <p>Name (Company): {p.name} ({p.company?.name})</p>
        <Link to={`/admin/places/${p.id}`}>View / Edit</Link>
      </div>) }
    </div>
    <Link to='/admin/places/new'>New Place</Link>
  </>
}