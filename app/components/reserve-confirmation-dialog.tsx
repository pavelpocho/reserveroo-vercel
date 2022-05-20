import React from "react";
import styled from "styled-components";
import { styles } from "~/constants/styles";
import { Reservable } from "~/models/reservable.server";
import { Reservation } from "~/models/reservation.server";
import { Res } from "~/routes/$placeId/reserve";
import { ReservableTypeWithTexts } from "~/types/types";
import { getStringDateValue, getStringTimeValue } from "~/utils/forms";
import { Indicator } from "./place/facilities-indicator";
import { MainButton, MainButtonBtn, SecondaryButtonBtn } from "./place/place-summary";

interface ConfirmationDialogProps {
  hidden: boolean,
  onConfirm: () => void,
  title: string,
  text: string,
  confirmText: string,
  cancelText: string,
  close: () => void,
  subHeaderText: string,
  resList: Res[],
  reservables: (Reservable & {
    reservations: Reservation[];
  } & {
      ReservableType: ReservableTypeWithTexts;
  })[],
  backupTitle: string,
  backupText1: React.ReactNode,
  backupText2: React.ReactNode,
}

const Wrap = styled.div<{ hidden: boolean }>`
  position: fixed;
  visibility: ${props => props.hidden ? 'hidden' : 'visible'};
  transition: opacity 0.15s ease-in-out, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: scale(0.9);
  opacity: 0;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Window = styled.div`
  background-color: ${styles.colors.white};
  box-shadow: ${styles.shadows[0]};
  width: 968px;
  display: flex;
  max-width: 100%;
  border-radius: 1rem;
  @media (max-width: 650px) {
    width: 100%;
    border-radius: 0;
  }
  flex-direction: column;
  gap: 1.3rem;
  padding: 1.5rem;
  z-index: 8;
  position: relative;
`;

const Backdrop = styled.div<{ hidden?: boolean }>`
  position: fixed;
  z-index: 7;
  display: ${props => props.hidden ? 'none' : ''};
  background-color: ${styles.colors.black}40;
  top: 0;
  left: 0;
  transform-origin: center;
  transform: scale(150%);
  width: 100vw;
  height: 100vh;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0px;
  font-size: 1.375rem;
  font-weight: 600;
`;

const Text = styled.p`
  margin: 0px;
  font-weight: 500;
  font-size: 0.875rem;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const SlotList = styled.div`
  padding: 1rem 1.6rem;
  display: flex;
  flex-direction: column;
  @media (min-width: 500px) {
    border-radius: 0.5rem;
  }
  gap: 1.5rem;
  background-color: ${styles.colors.primary};
`;

const BackupSlotList = styled(SlotList)`
  background-color: ${styles.colors.gray[5]};
`;

const ResE = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  @media (max-width: 400px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SlotListTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const WhiteSlotListTitle = styled(SlotListTitle)`
  color: ${styles.colors.white};
`;

const BackupSlotText = styled.p`

`;

const SlotText = styled(BackupSlotText)`
  color: ${styles.colors.white};  
`;

const FlexSL = styled.div`
  display: flex;
  align-items: center;
  column-gap: 1rem;
  row-gap: 0.4rem;
  flex-wrap: wrap;
  & > p {
    margin: 0;
  }
`;

export const ReserveConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ subHeaderText, reservables, resList, hidden, title, backupTitle, backupText1, backupText2, confirmText, cancelText, onConfirm, close }) => {

  const wrap = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setTimeout(() => {
      if (wrap.current) {
        wrap.current.style.opacity = hidden ? '0' : '1';
        wrap.current.style.transform = hidden ? 'scale(0.9)' : 'scale(1)';
      }
    }, 100);
  }, [hidden]);

  return <Wrap hidden={hidden} ref={wrap}>
    <Backdrop onClick={close} />
    <Window>
      <Title>{title}</Title>
      <Text>{subHeaderText}</Text>
      { resList.filter(r => !r.isBackup).length > 0 && <SlotList>
        <WhiteSlotListTitle>{resList.filter(r => r.isBackup).length > 0 ? `Preferred timeslot${resList.filter(r => !r.isBackup).length > 1 ? 's' : ''}` :`Picked timeslot${resList.filter(r => !r.isBackup).length > 1 ? 's' : ''}`}</WhiteSlotListTitle>
        { resList.filter(r => !r.isBackup).map(r => r.startTime && r.endTime && <ResE>
          <Indicator style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>{reservables.find(x => x.id == r.reservableId)?.name}</Indicator>
          <FlexSL>
            <SlotText>Date: {getStringDateValue(r.startTime)}</SlotText>
            <SlotText>Time: {getStringTimeValue(r.startTime)} - {getStringTimeValue(new Date(r.endTime))}</SlotText>
          </FlexSL>
        </ResE>) }
      </SlotList> }
      { resList.filter(r => r.isBackup).length > 0 && <BackupSlotList>
        <SlotListTitle>{'Backup timeslots'}</SlotListTitle>
        { resList.filter(r => r.isBackup).map(r => r.startTime && r.endTime && <ResE>
          <Indicator style={{ padding: '0.5rem' }}>{reservables.find(x => x.id == r.reservableId)?.name}</Indicator>
          <FlexSL>
            <BackupSlotText>{getStringDateValue(r.startTime)}</BackupSlotText>
            <BackupSlotText>{getStringTimeValue(r.startTime)} - {getStringTimeValue(new Date(r.endTime))}</BackupSlotText>
          </FlexSL>
        </ResE>) }
      </BackupSlotList> }
      <Title>{backupTitle}</Title>
      <Text>{backupText1}</Text>
      <Text>{backupText2}</Text>
      <ButtonRow>
        <SecondaryButtonBtn onClick={(e) => {
          e.preventDefault();
          close();
        }}>{cancelText}</SecondaryButtonBtn>
        <MainButtonBtn onClick={(e) => {
          onConfirm();
          close();
          e.preventDefault();
        }}>{confirmText}</MainButtonBtn>
      </ButtonRow>
    </Window>
  </Wrap>
}