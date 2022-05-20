import { OpeningTime, Reservable } from "@prisma/client";
import { Link, Outlet, useLoaderData } from "@remix-run/react"
import { json, LoaderFunction } from "@remix-run/server-runtime";
import React from "react";
import styled from "styled-components";
import ClockIcon from "~/assets/icons/Clock";
import LocationIcon from "~/assets/icons/Location";
import { FacilitiesIndicator } from "~/components/place/facilities-indicator";
import { PlaceImage } from "~/components/place/place-image";
import { getNextImportantTime } from "~/components/place/place-summary";
import { TagList } from "~/components/place/tag-list";
import { styles } from "~/constants/styles";
import { getPlace, Place } from "~/models/place.server";
import { ReservableTypeWithTexts, TagWithTexts } from "~/types/types";

interface LoaderData {
  place: (Place & {
    openingTimes: OpeningTime[],
    tags: TagWithTexts[],
    reservables: Reservable & {
      ReservableType: ReservableTypeWithTexts
    }[]
  }) | null | undefined,
  imageUrl: string | undefined
}

export const loader: LoaderFunction = async ({ params }) => {
  const place = await getPlace({ id: params.placeId ?? '' });
  return json({ place, imageUrl: place?.profilePicUrl });
}

const Banner = styled.div`
  padding: 2rem 1rem;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background-color: ${styles.colors.gray[5]};
`;

const PlaceInfoWrap = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PlaceName = styled(Link)`
  color: ${styles.colors.black};
  font-size: 1.4rem;
  font-weight: bold;
  text-decoration: none;
  @media (max-width: 600px) {
    text-align: center;
  }
`;

const LocationInfoWrap = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const LocationText = styled.p`
  margin: 0px;
  font-size: 1rem;
  font-weight: 500;
`;

const OuterFlex = styled.div`
  display: grid;
  grid-template-columns: 9rem 1fr;
  grid-template-rows: auto;
  gap: 2rem;
  max-width: 938px;
  width: 100%;
  @media (max-width: 600px) {
    grid-template-columns: auto;
    justify-items: center;
    grid-template-rows: repeat(2, auto);
    gap: 1rem;
  }
`;

const Flex = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Time = styled.p`
  margin: 0px;
  font-size: 1rem;
  font-weight: 500;
`;

const GeneralInfoWrap = styled.div`
  display: grid;
  gap: 0.8rem;
  align-items: stretch;
  grid-template-rows: repeat(3, auto);
`;

const FlexApart = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 1.5rem;
  row-gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
`;

export default function PlaceDetail() {

  const { place, imageUrl } = useLoaderData<LoaderData>();
  const [ position, setPosition ] = React.useState<number>(0);

  return <>
    {place ? <Banner>
      <OuterFlex>
        <PlaceImage shape='circle' imageUrl={imageUrl} />
        <PlaceInfoWrap>
          <GeneralInfoWrap>
            <PlaceName to={`/${place.id}`}>{place.name}</PlaceName>
            <FlexApart>
              <LocationInfoWrap>
                <LocationIcon height={'1rem'} />
                <LocationText>{place.street}, {place.city}</LocationText>
              </LocationInfoWrap>
              <Flex>
                <ClockIcon height='1rem' />
                <Time>{getNextImportantTime(place)}</Time>
              </Flex>
            </FlexApart>
            {/* <AvailabilityIndicator color='free' /> */}
            <FacilitiesIndicator reservables={place.reservables} />
            <TagList tags={place.tags} />
          </GeneralInfoWrap>
        </PlaceInfoWrap>
      </OuterFlex>
    </Banner> : <p>An error has occured.</p>}
    <Outlet />
  </>
}