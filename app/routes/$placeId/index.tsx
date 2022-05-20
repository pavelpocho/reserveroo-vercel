import { OpeningTime } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import styled from "styled-components";
import AnglesRightIcon from "~/assets/icons/AnglesRight";
import { MainButton } from "~/components/place/place-summary";
import { styles } from "~/constants/styles";
import { getPlace, Place } from "~/models/place.server";
import { Reservable } from "~/models/reservable.server";

const Wrap = styled.div`
  padding: 2rem;
  border-radius: 1.5rem;
  margin-top: 2rem;
  box-sizing: border-box;
  max-width: 968px;
  width: 100%;
  margin: 0px auto;
`;

const Title = styled.h4`
  font-size: 1.3rem;
  margin: 0px;
`;

const DetailsWrap = styled.div`

`;

const TimesWrap = styled.div`
  flex-shrink: 0;
  background-color: ${styles.colors.primary};
  color: ${styles.colors.white};
  padding: 1.5rem 1.25rem;
  border-radius: 0.5rem;
`;

const Desc = styled.p`

`;

const OpeningDay = styled.p`
  font-weight: bold;
  font-size: 0.75rem;
  margin: 0;
`;

const OpeningTime = styled.p`
  font-size: 1rem;
  margin: 0;
  &::first-letter {
    text-transform:capitalize;
  }
`;

interface PlaceDetailsLoaderData {
  place: (Place & {
    reservables: Reservable[];
    openingTimes: OpeningTime[];
  })
}

export const loader: LoaderFunction = async ({ params }) => {
  return json({ place: await getPlace({ id: params.placeId ?? '' }) });
}

const GalleryImage = styled.img`
  object-fit: cover;
  width: 20rem;
  aspect-ratio: 1;
  max-width: 90%;
`;

const Gallery = styled.div`
  overflow-x: scroll;
  width: 100%;
  border-radius: 0.5rem;
  margin-top: 1rem;
  white-space: nowrap;
`;

const FlexApart = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  gap: 2rem;
  @media (max-width: 800px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const TimesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`;

export default function PlaceDetails({}) {

  const { place } = useLoaderData<PlaceDetailsLoaderData>();

  const timeStr = (date: Date) => {
    return `${new Date(date).getHours()}:${new Date(date).getMinutes()}`;
  }

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  console.log(place.description != '' ? place.description : 'No description');

  return <Wrap>
    <FlexApart>
      <Title>Make a reservation</Title>
      <MainButton inSearch={false} to={`/${place.id}/reserve`} >Reserve<AnglesRightIcon height='1.25rem' /></MainButton>  
    </FlexApart>
    <FlexApart style={{ alignItems: 'flex-start' }}>
      <DetailsWrap>
        <Title>Description</Title>
        <Desc>{place.description != '' ? place.description :  <i>No description</i>}</Desc>
        <Title>How do I get there?</Title>
        <Desc>{place.howToGetThere != '' ? place.howToGetThere :  <i>Just follow Google Maps :)</i>}</Desc>
      </DetailsWrap>
      <TimesWrap>
        <Title>Opening Times</Title>
        <TimesGrid>
          { place.openingTimes ? place.openingTimes.sort((a, b) => a.day - b.day).map(o => <div key={o.id} >
            <OpeningDay>{daysOfWeek[o.day].split('')[0].toUpperCase() + daysOfWeek[o.day].split('').slice(1).join('')}</OpeningDay>
            <OpeningTime>{timeStr(o.open)} - {timeStr(o.close)}</OpeningTime>
          </div>) : null }
        </TimesGrid>
      </TimesWrap>
    </FlexApart>
    { place.galleryPicUrls.length > 0 && <>
      <Title>Gallery</Title>
      <Gallery>
        {place.galleryPicUrls.map((p, i) => <GalleryImage key={i} src={p} />)}
      </Gallery>
    </>}
  </Wrap>
}