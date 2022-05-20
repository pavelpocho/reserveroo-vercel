import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { getPlaceList, Place } from "~/models/place.server";
import styled from "styled-components";
import { SearchBar } from "~/components/search/search-bar";
import { PlaceSummary } from "~/components/place/place-summary";
import { styles } from "~/constants/styles";
import { Category, Location, OpeningTime, Reservable, Tag } from "@prisma/client";
import { getAllLocations, getLocation, getLocationByName } from "~/models/location.server";
import { getTagList } from "~/models/tag.server";
import { getCategoryList } from "~/models/category.server";
import { CategoryWithTexts, LocationWithEverything, LocationWithTexts, ReservableTypeWithTexts, TagWithTexts } from "~/types/types";
import { IconRow } from "~/components/icon-row";
import { addToSearchHistory } from "~/models/user.server";
import { getUsernameAndAdmin } from "~/utils/session.server";
import { WidthRestrictor } from "~/root";
import { SearchUI } from "~/components/search/search-ui";

interface LoaderData {
  locations: LocationWithEverything[],
  tags: TagWithTexts[],
  categories: CategoryWithTexts[],
  places: (Place & {
    tags: TagWithTexts[];
    openingTimes: OpeningTime[];
    reservables: Reservable & {
      ReservableType: ReservableTypeWithTexts
    }[]
  })[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get('searchTerm');
  const location =  url.searchParams.get('selectedLocation');
  const dontSave =  url.searchParams.get('dontSave');
  const tags = url.searchParams.getAll('tags[]');
  const categories = url.searchParams.getAll('categories[]');
  const usernameAndAdmin = await getUsernameAndAdmin(request);

  if (usernameAndAdmin.username != null && dontSave != '1') await addToSearchHistory({
    username: usernameAndAdmin.username,
    phrase: searchTerm ?? '',
    locationId: location ? (await getLocationByName({ cityCountry: location }))?.id ?? null : null,
    tagIds: tags,
    categoryIds: categories
  })

  return json({
    places: await getPlaceList({ name: searchTerm ?? '', cityCountry: !location || location == '' ? undefined : location, tagIds: tags, catIds: categories }),
    locations: await getAllLocations(),
    tags: await getTagList({ nameFragment: '' }),
    categories: await getCategoryList({ nameFragment: '' }),
  });
};

const Title = styled.h6`
  font-size: 1.7rem;
  margin: 0 0 1.5rem 0;
  @media (max-width: 800px) {
    padding: 0rem 2rem;
  }
`;

const TopSegment = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${styles.colors.primary};
`;

const MainSegment = styled.div`
  padding: 3rem 0;
  display: grid;
  gap: 2rem;
  align-items: flex-start;
  grid-template-columns: 22rem 1fr;
  @media (max-width: 800px) {
    grid-template-columns: 100%;
    grid-template-rows: auto 1fr;
  }
`;

const PlacesColumn = styled.div`
  flex-grow: 1;
`;

export default function Search() {
  
  const { places, locations, tags, categories } = useLoaderData<LoaderData>();

  console.log(places);

  const searchParams = useSearchParams()[0];
  return (
    <div>
      <TopSegment>
        <IconRow />
      </TopSegment>
      <WidthRestrictor width={'1368px'}>
        <MainSegment>
          <SearchUI
            searchParams={searchParams}
            locations={locations}
            tags={tags}
            categories={categories}
            narrowView={true}
          />
          <PlacesColumn>
            <Title>Search Results</Title>
            {places.filter(p => !p.hidden).map((place) => (
              <PlaceSummary place={place} key={place.id} inSearch={true} />
            ))}
          </PlacesColumn>
        </MainSegment>
      </WidthRestrictor>
    </div>
  );
}