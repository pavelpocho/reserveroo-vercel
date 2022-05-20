import { Form, useSubmit } from "@remix-run/react";
import React from "react";
import styled from "styled-components";
import LocationIcon from "~/assets/icons/Location";
import SearchIcon from "~/assets/icons/Search";
import TableListIcon from "~/assets/icons/TableList";
import TagsIcon from "~/assets/icons/Tags";
import { styles } from "~/constants/styles";
import { useLangs } from "~/contexts/langsContext";
import { CategoryWithTexts, LocationWithEverything, TagWithTexts } from "~/types/types";
import { IdInput } from "./inputs/ObjectInput";

interface RecentSearchProps {
  searchPhrase: string,
  location: LocationWithEverything | null,
  categories: CategoryWithTexts[],
  tags: TagWithTexts[]
}

const Wrap = styled.button`
  background-color: ${styles.colors.primary};
  border-radius: 0.5rem;
  cursor: pointer;
  display: block;
  border: none;
  text-align: start;
  color: white;
  padding: 1.125rem;
  margin: 0;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  & svg {
    flex-shrink: 0;
  }
  &:hover {
    transform: scale(1.02);
  }
  @media (max-width: 550px) {
    border-radius: 0;
  }
`;

const Title = styled.h5`
  font-size: 1.25rem;
  margin: 0 0 1.1rem 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, auto));
  @media (max-width: 450px) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: repeat(4, minmax(0, auto));
  }
  gap: 1.25rem;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8125rem;
`;

const Text = styled.p`
  font-size: 1rem;
  margin: 0;
`;

export const RecentSearch: React.FC<RecentSearchProps> = ({ searchPhrase, location, categories, tags }) => {

  const { lang } = useLangs();
  const s = useSubmit();
  const form = React.useRef<HTMLFormElement>(null)

  return <Wrap onClick={() => {
    if (form.current) {
      s(form.current);
    }
  }}>
    <Form method='get' action='/search' ref={form}>
      <IdInput name='selectedLocation' value={location?.cityCountry ?? ''} />
      { categories.map(c => <IdInput key={c.id} value={c.id} name='categories[]' />) }
      { tags.map(t => <IdInput key={t.id} value={t.id} name='tags[]' />) }
      <IdInput name='searchTerm' value={searchPhrase} />
      <IdInput name='dontSave' value={'1'} />
    </Form>
    <Title>{searchPhrase != '' ? `"${searchPhrase}"` : categories.length == 1 ? (categories[0].multiLangName && categories[0].multiLangName[lang]) : 'All Activities'} {location?.multiLangCity && `in ${location.multiLangCity[lang]}`}</Title>
    <Grid>
      <Flex>
        {location?.multiLangCity &&  <LocationIcon fill={styles.colors.white} height={'1.25rem'} />}
        {location?.multiLangCity && location?.multiLangCity[lang]}{(location?.multiLangCity || location?.multiLangCountry) && ','} {location?.multiLangCountry && location?.multiLangCountry[lang]}
      </Flex>
      <Flex>
        {(categories.length > 0) && <TableListIcon fill={styles.colors.white} height={'1.25rem'} />}
        {categories.map(c => (c?.multiLangName ? c.multiLangName[lang] : '')).join(', ')}
      </Flex>
      <Flex>
        <SearchIcon fill={styles.colors.white} height={'1.25rem'} />
        <Text>{searchPhrase == '' ? <i>No search phrase</i> : searchPhrase}</Text>
      </Flex>
      <Flex>
        {(tags.length > 0) && <TagsIcon fill={styles.colors.white} height={'1.25rem'} />}
        {tags.map(t => (t?.multiLangName ? t.multiLangName[lang] : '')).join(', ')}
      </Flex>
    </Grid>
  </Wrap>
}