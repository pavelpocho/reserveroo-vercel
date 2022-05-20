import { OpeningTime, Place, Reservable } from "@prisma/client";
import { Link } from "@remix-run/react";
import React from "react";
import styled from "styled-components"
import AngleRightIcon from "~/assets/icons/AngleRight";
import AnglesRightIcon from "~/assets/icons/AnglesRight";
import ClockIcon from "~/assets/icons/Clock";
import LocationIcon from "~/assets/icons/Location";
import { styles } from "~/constants/styles";
import { UnstyledLink } from "~/root";
import { ReservableTypeWithTexts, TagWithTexts } from "~/types/types";
import { getDayOfWeek } from "~/utils/forms";
import { FacilitiesIndicator } from "./facilities-indicator";
import { PlaceImage } from "./place-image";
import { TagList } from "./tag-list";

export const PlaceWrap = styled.div<{ inSearch: boolean }>`
  background-color: ${styles.colors.gray[5]};
  margin-bottom: 2.125rem;
  display: grid;
  grid-template-columns: 11rem 1fr;
  padding: 1.2rem 1.2rem;
  position: relative;
  @media (max-width: ${props => props.inSearch ? '1100px' : '800px'}) {
    grid-template-columns: unset;
    grid-template-rows: 11rem 1fr;
  }
  @media (min-width: 550px) {
    border-radius: 0.5rem;
  }
`;

export const PlaceName = styled(UnstyledLink)<{ inSearch: boolean }>`
  font-size: 1.4rem;
  font-weight: bold;
  color: ${styles.colors.black};
  @media (max-width: ${props => props.inSearch ? '1100px' : '800px'}) {
    margin-top: 1rem;
  }
`;

export const PlaceInfoWrap = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: grid;
  gap: 0.8rem;
  grid-template-rows: repeat(5, auto);
  justify-self: stretch;
`;

const Address = styled.p`
  display: flex;
  font-weight: 500;
  margin: 0;
`;

const Flex = styled.div<{ inSearch: boolean }>`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  align-items: center;
  @media (max-width: ${props => props.inSearch ? '800px' : '500px'}) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const FlexApart = styled(Flex)<{ inSearch: boolean }>`
  justify-content: space-between;
  align-self: stretch;
  @media (max-width: ${props => props.inSearch ? '800px' : '500px'}) {
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

const BaseButton = styled(Link)<{ inSearch: boolean }>`
  background-color: transparent;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 1.6rem;
  font-size: 1rem;
  font-weight: 600;
  gap: 1.3rem;
  border-radius: 0.25rem;
  box-sizing: border-box;
  text-decoration: none;
  flex-shrink: 0;
  color: ${styles.colors.black};
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  &:hover {
    transform: scale(1.08);
  }
  @media (max-width: ${props => props.inSearch ? '800px' : '500px'}) {
    width: 100%;
  }
`;

export const SecondaryButton = styled(BaseButton)<{ inSearch: boolean }>`
  border: 1.5px solid #22222240;
  color: ${styles.colors.gray[140]};
`;

export const MainButton = styled(BaseButton)<{ inSearch: boolean }>`
  border: 1.5px solid ${styles.colors.action};
  background-color: ${styles.colors.action};
`;

const BaseButtonBtn = styled.button`
  background-color: transparent;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 1.6rem;
  font-size: 1rem;
  font-weight: bold;
  gap: 1.3rem;
  border-radius: 0.25rem;
  box-sizing: border-box;
  text-decoration: none;
  color: ${styles.colors.black};
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  &:hover {
    transform: scale(1.08);
  }
`;

export const SecondaryButtonBtn = styled(BaseButtonBtn)`
  border: 1.5px solid #22222240;
  color: ${styles.colors.gray[140]};
`;

export const MainButtonBtn = styled(BaseButtonBtn)`
  border: 1.5px solid ${styles.colors.action};
  background-color: ${styles.colors.action};
  &:disabled {
    background-color: ${styles.colors.gray[60]};
    &:hover {
      transform: none;
      cursor: default;
    }
  }
`;

const Time = styled.p`
  font-weight: 500;
  margin: 0px;
`;

interface PlaceProps {
  place: Place & {
    tags: TagWithTexts[];
    openingTimes: OpeningTime[];
    reservables: Reservable & {
      ReservableType: ReservableTypeWithTexts
    }[];
  };
  inSearch?: boolean
}

export const getNextImportantTime = (place: Place & {
  openingTimes: OpeningTime[];
  reservables: Reservable & {
    ReservableType: ReservableTypeWithTexts
  }[];
}) => {
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const closeToday = new Date(place.openingTimes.find(o => o.day == getDayOfWeek(new Date()))?.close ?? '');
  const openTomorrow = new Date(place.openingTimes.find(o => o.day == getDayOfWeek(tomorrow))?.open ?? '');
  
  if (new Date().getHours() * 60 + new Date().getMinutes() > closeToday.getHours() * 60 + closeToday.getMinutes()) {
    return `Opens at ${openTomorrow.toLocaleTimeString()} tomorrow.`;
  }
  return `Closes at ${closeToday.toLocaleTimeString()} today.`;
}

export const PlaceSummary: React.FC<PlaceProps> = ({ place, inSearch }) => {

  return <PlaceWrap inSearch={inSearch ?? false}>
    <PlaceImage shape='square' imageUrl={place.profilePicUrl} />
    <PlaceInfoWrap>
      <FlexApart inSearch={inSearch ?? false}>
        <PlaceName inSearch={inSearch ?? false} to={`/${place.id}`}>{place.name}</PlaceName>
      </FlexApart>
      <FlexApart inSearch={inSearch ?? false}>
        <Flex inSearch={inSearch ?? false}>
          {place.street && place.city && <>
            <LocationIcon height='1rem' />
            <Address>{place.street}, {place.city}</Address>
          </>}
        </Flex>
        <Flex inSearch={inSearch ?? false}>
          <ClockIcon height='1rem' />
          <Time>{getNextImportantTime(place)}</Time>
        </Flex>
      </FlexApart>
      <FacilitiesIndicator reservables={place.reservables} />
      <TagList tags={place.tags} />
      <FlexApart inSearch={inSearch ?? false}>
        <span></span>
        <Flex inSearch={inSearch ?? false}>
          <SecondaryButton inSearch={inSearch ?? false} to={`/${place.id}`}>See Details<AngleRightIcon height='1.25rem' /></SecondaryButton>
          <MainButton inSearch={inSearch ?? false} to={`/${place.id}/reserve`}>Reserve<AnglesRightIcon height='1.25rem' /></MainButton>
        </Flex>
      </FlexApart>
    </PlaceInfoWrap>
  </PlaceWrap>
}