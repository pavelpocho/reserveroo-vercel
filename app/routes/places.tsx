import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { getNewPlaces, Place } from "~/models/place.server";
import styled from "styled-components";
import { PlaceSummary } from "~/components/place/place-summary";
import { styles } from "~/constants/styles";
import { OpeningTime, Reservable, Search } from "@prisma/client";
import { SearchUI } from "~/components/search/search-ui";
import { getAllLocations } from "~/models/location.server";
import { getTagList } from "~/models/tag.server";
import { getCategoryList } from "~/models/category.server";
import { CategoryWithTexts, LocationWithEverything, ReservableTypeWithTexts, TagWithTexts } from "~/types/types";
import { WidthRestrictor } from "~/root";
import { IconRow } from "~/components/icon-row";
import HeartIcon from "~/assets/icons/Heart";
import { RecentSearch } from "~/components/recent-search";
import { getUsernameAndAdmin } from "~/utils/session.server";
import { getSearchHistory } from "~/models/user.server";

interface LoaderData {
  locations: LocationWithEverything[],
  tags: TagWithTexts[],
  categories: CategoryWithTexts[],
  places: (Place & {
    openingTimes: OpeningTime[];
    reservables: Reservable & {
      ReservableType: ReservableTypeWithTexts
    }[],
    tags: TagWithTexts[]
  })[],
  searchHistory: (Search & {
    location: LocationWithEverything | null;
    Categories: CategoryWithTexts[];
    Tags: TagWithTexts[];
  })[] | null;
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get('searchTerm');
  const location =  url.searchParams.get('selectedLocation');
  const tags = url.searchParams.getAll('tags[]');
  const categories = url.searchParams.getAll('categories[]');

  const usernameAndAdmin = await getUsernameAndAdmin(request);

  return json({
    places: await getNewPlaces(),
    locations: await getAllLocations(),
    tags: await getTagList({ nameFragment: '' }),
    categories: await getCategoryList({ nameFragment: '' }),
    searchHistory: usernameAndAdmin.username ? (await getSearchHistory({ username: usernameAndAdmin.username }))?.searchHistory : null
  });
};

const Title = styled.h6`
  font-size: 2.625rem;
  @media (max-width: 800px) {
    font-size: 2rem;
  }
  @media (max-width: 550px) {
    padding: 0 1rem;
  }
  @media (max-width: 400px) {
    font-size: 1.5rem;
  }
  text-align: center;
  margin: 0 0 0.625rem 0;
  color: ${styles.colors.white};
`;

const TopSegment = styled.div`
  padding: 2.45rem 0 2.375rem;
  @media (max-width: 800px) {
    padding: 1.45rem 0.75rem 2rem;
  }
  @media (max-width: 550px) {
    padding: 1.45rem 0rem 2rem;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${styles.colors.primary};
  overflow-x: hidden;
`;

const MainSegment = styled.div`
  padding: 3rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WelcomeWrap = styled.div`
  background-color: ${styles.colors.primary_background};
  @media (min-width: 550px) {
    border-radius: 1rem;
  }
  padding: 2rem;
  position: relative;
`;

const WelcomeTitle = styled.h4`
  margin: 0 0 2rem 0;
  font-size: 1.3rem;
  font-size: 700;
`;

const SectionWrap = styled.div`
`;

const SectionTitle = styled.h4`
  margin: 2rem 0 2rem 2rem;
  font-size: 1.3rem;
  font-size: 700;
`;

const WelcomeText = styled.p`
  margin: 0 0 1rem;
  font-weight: 500;
  font-size: 0.8rem;
`;

const HeartWrap = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 5rem;
  transform: rotate(35deg);
`;

const SearchHistory = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
  gap: 1.25rem;
`;

const It = styled.i`
  margin-left: 2rem;
`;

export default function Places() {
  
  const { places, locations, tags, categories, searchHistory } = useLoaderData<LoaderData>();

  const searchParams = useSearchParams()[0];
  return (
    <div>
      <TopSegment>
        <WidthRestrictor> 
          <Title>Book a spot anywhere. Right here.</Title>
          <IconRow />
          <SearchUI
            searchParams={searchParams}
            locations={locations}
            tags={tags}
            categories={categories}
          />
        </WidthRestrictor>
      </TopSegment>
      <MainSegment>
        <WidthRestrictor>
          <WelcomeWrap>
            <WelcomeTitle>Figuring things out? Us too!</WelcomeTitle>
            <WelcomeText>Our goal is to simplify booking activies, anywhere you are. But we are just getting started and we need your help to make it all happen.</WelcomeText>
            <WelcomeText>How can you help? Make a reservation. Or share this website with your friends and family. That’s all we ask for.</WelcomeText>
            <HeartWrap>
              <HeartIcon height={'2.375rem'} fill={styles.colors.action_light} />
            </HeartWrap>
          </WelcomeWrap>
          { searchHistory && <SectionWrap>
            <SectionTitle>Your Recent Searches</SectionTitle>
            <SearchHistory>
            { searchHistory.length == 0 ? <It>You haven't yet searched for anything. Give it a try!</It> : null }
            {searchHistory.map((s) => <RecentSearch key={s.id} searchPhrase={s.phrase} location={s.location} categories={s.Categories} tags={s.Tags}>
            </RecentSearch>)}
            </SearchHistory>
          </SectionWrap>}
          <SectionWrap>
            <SectionTitle>Newly Listed Places</SectionTitle>
            {places.filter(p => !p.hidden).map((place) => (
              <PlaceSummary place={place} key={place.id} />
            ))}
          </SectionWrap>
        </WidthRestrictor>
      </MainSegment>
    </div>
  );
}