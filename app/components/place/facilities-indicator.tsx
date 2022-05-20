import styled from "styled-components";
import { styles } from "~/constants/styles";
import { useLangs } from "~/contexts/langsContext";
import { Reservable } from "~/models/reservable.server"
import { ReservableTypeWithTexts } from "~/types/types";

interface FacilitiesIndicatorProps {
  reservables: Reservable & {
    ReservableType: ReservableTypeWithTexts
  }[]
}

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.3125rem;
  row-gap: 0.5rem;
`;

export const Indicator = styled.p`
  background-color: ${styles.colors.white};
  box-shadow: ${styles.shadows[2]};
  margin: 0px;
  display: flex;
  border-radius: 0.375rem;
  padding: 0.3rem 0.2rem 0.3rem 0.7rem;
  font-weight: 500;
  gap: 0.5rem;
  align-items: center;
`;

export const Amount = styled.span`
  background-color: ${styles.colors.gray[5]};
  color: ${styles.colors.primary};
  font-weight: 600;
  padding: 0.3rem 0.8rem;
  font-size: 0.8rem;
  border-radius: 0.25rem;
`;

interface ReservableGroup {
  id: string,
  name: string
  amountOfReservables: number
}

export const FacilitiesIndicator: React.FC<FacilitiesIndicatorProps> = ({ reservables }) => {

  const { lang } = useLangs();

  const reservableGroups: ReservableGroup[] = [];
  reservables.forEach(r => {
    if (!r.ReservableType) return;
    let rg = reservableGroups.find(rg => rg.id == r.ReservableType.id);
    if (rg != null) {
      rg.amountOfReservables += 1;
    }
    else {
      reservableGroups.push({
        id: r.ReservableType.id,
        name: r.ReservableType.multiLangName ? r.ReservableType.multiLangName[lang] : '',
        amountOfReservables: 1
      });
    }
  })

  return <Wrap>{
    reservableGroups.map((r) => <Indicator key={r.id}>{r.name} <Amount>x{r.amountOfReservables}</Amount></Indicator>)
  }</Wrap>
}