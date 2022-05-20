import { Company, Place, Reservable, Reservation, ReservationGroup, User } from "@prisma/client"
import { Form, Link } from "@remix-run/react";
import React from "react";
import styled from "styled-components";
import { styles } from "~/constants/styles";
import { ReservationStatus } from "~/types/types"
import { Button } from "../button";
import { IdInput } from "../inputs/ObjectInput";
import { ReservationSummary } from "../profile/reservation-summary"
import { AdminReservationSummary } from "./reservation-summary";

interface ReservationGroupSummaryProps {
  reservationGroup: (ReservationGroup & {
    user: User | null;
    reservations: (Reservation & {
        reservable: (Reservable & {
            place: (Place & {
              company: Company | null;
            });
        }) | null;
    })[];
  }),
  onChangeStatus: (reservationGroupId: string, formRef: HTMLFormElement) => void
}

const Title = styled.h5`
  margin: 0;
  font-size: 1.2rem;
`;

const InfoTitle = styled.p`
  font-weight: bold;
  font-size: 0.9rem;
  margin: 0;
  margin-top: 1.5rem;
  color: ${styles.colors.action};
`;

const Value = styled.p`
  font-size: 1.2rem;
  margin-top: 0.2rem;
  margin-bottom: 0;
`;

const SummaryInfoWrap = styled.div`
  display: flex;
  gap: 2rem;
`;

const Wrap = styled.div`
  display: flex;
  overflow: hidden;
  transition:
    height 0.3s cubic-bezier(0.33, 1, 0.68, 1),
    padding 0.3s cubic-bezier(0.33, 1, 0.68, 1),
    margin 0.3s cubic-bezier(0.33, 1, 0.68, 1),
    opacity 0.3s cubic-bezier(0.33, 1, 0.68, 1);
  box-shadow: ${styles.shadows[0]};
  border-radius: 0.6rem;
  background-color: ${styles.colors.white};
  padding: 1.3rem 1rem;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 1rem;
  &>* {
    flex-shrink: 0;
  }
`;

const InnerWrap = styled.div`
`;

export const AdminReservationGroupSummary: React.FC<ReservationGroupSummaryProps> = ({ reservationGroup: rg, onChangeStatus }) => {

  const ref = React.useRef<HTMLDivElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  return <>
    <Wrap key={rg.id} ref={ref}>
      <InnerWrap>
        <Title>{rg.user?.username}</Title>
        { rg.reservations.map(r => <div key={r.id}>
          <AdminReservationSummary reservation={r} />
        </div>) }
        <SummaryInfoWrap>
          <div>
            <InfoTitle>Created</InfoTitle>
            <Value>{new Date(rg.createdAt).toDateString()}, {new Date(rg.createdAt).toTimeString()}</Value>
          </div>
          <div>
            <InfoTitle>Note to business</InfoTitle>
            <Value>{rg.note}</Value>
          </div>
        </SummaryInfoWrap>
      </InnerWrap>
      <InnerWrap>
        {(rg.reservations.length > 0 ? rg.reservations[0].status : ReservationStatus.Cancelled) != ReservationStatus.Cancelled && <>
          <Form method='post' ref={formRef} onChange={(e) => {
            onChangeStatus(rg.id, e.currentTarget);
          }}>
            <IdInput name={'rgId'} value={rg.id} />
            <select name='status' defaultValue={rg.reservations.length > 0 ? rg.reservations[0].status.toString() : '5'}>
              <option value='0'>Awaiting confirmation</option>
              <option value='1'>Confirmed</option>
              <option value='2'>Rejected</option>
              <option value='3'>Cancelled</option>
              <option value='4'>Paid</option>
              <option value='5'>Nothing Reserved</option>
            </select>
          </Form>
          <Link to={`/admin/reservations/${rg.id}`}>Edit</Link>
        </>}
      </InnerWrap>
    </Wrap>
  </>
}