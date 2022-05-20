import type { Reservable } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Reservable } from "@prisma/client";

export const getReservable = async ({ id }: Pick<Reservable, 'id'>) => (await prisma.reservable.findFirst({
  where: { id },
}));

export const getReservableList = async () => (await prisma.reservable.findMany({
}));

export const createReservable = async ({
  placeId,
  name,
  minimumReservationTime,
  reservationsPerSlot,
  reservableTypeId,
  reservableDaysAhead
}: Pick<Reservable, 'placeId' | 'name' | 'minimumReservationTime' | 'reservationsPerSlot' | 'reservableDaysAhead' | 'reservableTypeId'>) => (await prisma.reservable.create({
  data: {
    placeId, name, minimumReservationTime, reservationsPerSlot, reservableTypeId, reservableDaysAhead
  },
}));

export const updateReservable = async ({
  id,
  placeId,
  name,
  minimumReservationTime,
  reservationsPerSlot,
  reservableTypeId,
  reservableDaysAhead
}: Pick<Reservable, 'id' | 'placeId' | 'name' | 'minimumReservationTime' | 'reservationsPerSlot' | 'reservableDaysAhead' | 'reservableTypeId'>) => (await prisma.reservable.update({
  where: {
    id
  },
  data: {
    placeId, name, minimumReservationTime, reservationsPerSlot, reservableTypeId, reservableDaysAhead
  }
}));

export const deleteReservable = ({ id }: Pick<Reservable, 'id'>) => (prisma.reservable.deleteMany({
    where: { id },
}));
