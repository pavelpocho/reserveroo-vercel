import { Location } from '@prisma/client';
import { Link, useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { useLangs } from '~/contexts/langsContext';
import { getAllLocations } from '~/models/location.server';
import { LocationWithTexts } from '~/types/types';

interface LocationsAdminLoaderData {
  locations: LocationWithTexts[];
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const locations = await getAllLocations();
  return { locations }
}

export default function CompaniesAdminIndex() {

  const { locations } = useLoaderData<LocationsAdminLoaderData>();

  const { lang } = useLangs();

  return <>
    <div>
      { locations.map(l => <div key={l.id}>
        <p>City: {l.multiLangCity && l.multiLangCity[lang]}</p>
        <p>Country: {l.multiLangCountry && l.multiLangCountry[lang]}</p>
        <Link to={`/admin/locations/${l.id}`}>View / Edit</Link>
      </div>) }
      <Link to={'/admin/locations/new'} >New location</Link>
    </div>
  </>
}