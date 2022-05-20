import { Location } from "@prisma/client"
import styled from "styled-components";
import { styles } from "~/constants/styles";
import { useLangs } from "~/contexts/langsContext";
import { LocationWithEverything, LocationWithTexts } from "~/types/types";

interface LocationPickerProps {
  locations: LocationWithEverything[],
  selectedLocation?: Location | null,
  setLocation: (location: Location | null) => void
}

const Wrap = styled.div`
  overflow-x: scroll;
  white-space: nowrap;
  width: 100%;
`;

const Item = styled.button<{ selected: boolean }>`
  flex-shrink: 0;
  font-size: 1rem;
  padding: 1rem 1.5rem;
  color: ${props => props.selected ? styles.colors.white : styles.colors.primary};
  background-color: ${props => props.selected ? styles.colors.primary : styles.colors.white};
  border: 1px solid ${styles.colors.gray[30]};
  border-radius: 0.6rem;
  display: inline-block;
  cursor: pointer;
`;

export const LocationPicker: React.FC<LocationPickerProps> = ({ locations, setLocation, selectedLocation }) => {

  const { lang } = useLangs();

  return <Wrap>
    { locations.map(l => <Item selected={selectedLocation != null && selectedLocation.id == l.id} onClick={() => {
      setLocation(selectedLocation && l.id == selectedLocation.id ? null : l);
    }} key={l.id}>
      { l.multiLangCity && l.multiLangCountry && `${l.multiLangCity[lang]}, ${l.multiLangCountry[lang]}` }
    </Item>) }
  </Wrap>
}