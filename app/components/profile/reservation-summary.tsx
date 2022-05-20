import { Place, Reservable, Reservation } from "@prisma/client"
import styled from "styled-components";
import CalendarIcon from "~/assets/icons/Calendar";
import ClockIcon from "~/assets/icons/Clock";
import { styles } from "~/constants/styles";
import { useLangs } from "~/contexts/langsContext";
import { ReservableTypeWithTexts, ReservationStatus as R } from "~/types/types"
import { getStringTimeValue } from "~/utils/forms";
import { Amount, Indicator } from "../place/facilities-indicator";

interface ReservationSummaryProps {
  reservation: Reservation & {
    reservable: (Reservable & {
      ReservableType: ReservableTypeWithTexts
      place: Place
    }) | null;
  }
}

const Wrap = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  &>div {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.7rem;
  }
`;

const Value = styled.p`
  font-size: 0.9125rem;
  margin-top: 0.2rem;
  font-weight: 500;
  margin-bottom: 0;
`;

export const ReservationSummary: React.FC<ReservationSummaryProps> = ({ reservation: r }) => {

  const { lang } = useLangs();

  return <Wrap>
    { r?.reservable?.ReservableType.multiLangName && <Indicator style={{ padding: '0.5rem 1rem' }} key={r.id}>{r.reservable.ReservableType.multiLangName[lang]}</Indicator>}
    <Flex>
      <div>
        <CalendarIcon height={'1rem'} /><Value>{new Date(r.start).toLocaleDateString()}</Value>
      </div>
      <div>
        <ClockIcon height={'1rem'} /><Value>{getStringTimeValue(new Date(r.start))} - {getStringTimeValue(new Date(r.end))}</Value>
      </div>
    </Flex>
  </Wrap>
}