import { Company, Place, Reservable, Reservation } from "@prisma/client"
import styled from "styled-components";
import { styles } from "~/constants/styles";
import { ReservationStatus } from "~/types/types"
import { getStringTimeValue } from "~/utils/forms";

interface ReservationSummaryProps {
  reservation: (Reservation & {
    reservable: (Reservable & {
        place: (Place & {
          company: Company | null;
        });
    }) | null;
  })
}

const Wrap = styled.div`
  display: flex;
  gap: 2rem;
`;

const Title = styled.p`
  font-weight: bold;
  font-size: 0.9rem;
  margin: 0;
  margin-top: 1rem;
  color: ${styles.colors.action};
`;

const Value = styled.p`
  font-size: 1.2rem;
  margin-top: 0.2rem;
  margin-bottom: 0;
`;

export const AdminReservationSummary: React.FC<ReservationSummaryProps> = ({ reservation: r }) => {
  return <Wrap>
    {/* <div>
      <Title>Company</Title>
      <Value>{r.reservable?.place.company?.name ?? ''}</Value>
    </div> */}
    <div>
      <Title>Place</Title>
      <Value>{r.reservable?.place.name}</Value>
    </div>
    <div>
      <Title>Facility</Title>
      <Value>{r.reservable?.name}</Value>
    </div>
    <div>
      <Title>Start</Title>
      <Value>{new Date(r.start).toLocaleDateString()} - {getStringTimeValue(new Date(r.start))}</Value>
    </div>
    <div>
      <Title>End</Title>
      <Value>{new Date(r.end).toLocaleDateString()} - {getStringTimeValue(new Date(r.end))}</Value>
    </div>
    <div>
      <Title>Status</Title>
      <Value>{
        (r.status) == ReservationStatus.AwaitingConfirmation ? 'Awaiting confirmation' : 
        (r.status) == ReservationStatus.Confirmed ? 'Confirmed' : 
        (r.status) == ReservationStatus.Rejected ? 'Rejected' : 
        (r.status) == ReservationStatus.Cancelled ? 'Cancelled' : 
        (r.status) == ReservationStatus.Paid ? 'Paid' :
        (r.status) == ReservationStatus.Past ? 'Past' : '' 
      }</Value>
    </div>
    <div>
      <Title>Previous Status</Title>
      <Value>{
        (r.previousStatus) == ReservationStatus.AwaitingConfirmation ? 'Awaiting confirmation' : 
        (r.previousStatus) == ReservationStatus.Confirmed ? 'Confirmed' : 
        (r.previousStatus) == ReservationStatus.Rejected ? 'Rejected' : 
        (r.previousStatus) == ReservationStatus.Cancelled ? 'Cancelled' : 
        (r.previousStatus) == ReservationStatus.Paid ? 'Paid' :
        (r.previousStatus) == ReservationStatus.Past ? 'Past' : '' 
      }</Value>
    </div>
    { r.backup && <div>
      <Title>Backup</Title>
      <Value>This slot is a backup.</Value>
    </div> }
  </Wrap>
}