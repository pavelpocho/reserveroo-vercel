import type { Reservation } from "@prisma/client";

import { prisma } from "~/db.server";
import { ReservationStatus } from "~/types/types";

export type { Reservation } from "@prisma/client";

export const getReservation = async ({ id }: Pick<Reservation, 'id'>) => (await prisma.reservation.findFirst({
  where: { id },
}));

export const getReservationList = async () => (await prisma.reservation.findMany({
}));

export const createReservation = async ({ backup, reservationGroupId, reservableId, start, end }: Pick<Reservation, 'backup' | 'reservationGroupId' | 'reservableId' | 'start' | 'end'>) => (await prisma.reservation.create({
  data: {
    reservableId, reservationGroupId, start, end, backup
  },
}));

export const updateReservation = async ({ id, backup, reservationGroupId, reservableId, start, end }: Pick<Reservation, 'id' | 'backup' | 'reservationGroupId' | 'reservableId' | 'start' | 'end'>) => (await prisma.reservation.update({
  where: {
    id
  },
  data: {
    reservableId, reservationGroupId, start, end, backup
  }
}));

const getStatusOfReservation = async({ reservationGroupId }: Pick<Reservation, 'reservationGroupId'>) => (await prisma.reservation.findFirst({
  where: {
    reservationGroupId
  },
  select: {
    status: true
  }
}))

export const setStatusOfReservationsInGroup = async ({ reservationGroupId, status }: Pick<Reservation, 'reservationGroupId' | 'status'>) => {
  const r = await getStatusOfReservation({ reservationGroupId });
  return await prisma.reservation.updateMany({
    where: {
      reservationGroupId
    },
    data: {
      status,
      previousStatus: r?.status
    }
  })
};

export const changeReservationStatus = async ({ id, status }: Pick<Reservation, 'id' | 'status'>) => (await prisma.reservation.update({
  where: {
    id
  },
  data: {
    status
  }
}));

export const deleteReservation = ({ id }: Pick<Reservation, 'id'>) => (prisma.reservation.deleteMany({
    where: { id },
}));
