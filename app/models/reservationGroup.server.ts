import type { ReservationGroup } from "@prisma/client";

import { prisma } from "~/db.server";

export type { ReservationGroup } from "@prisma/client";

export const getReservationGroup = async ({ id }: Pick<ReservationGroup, 'id'>) => (await prisma.reservationGroup.findFirst({
  where: { id },
  include: {
    reservations: {
      include: {
        reservable: {
          include: {
            place: {
              include: {
                openingTimes: true,
                reservables: {
                  include: {
                    reservations: true
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}));

export const getReservationGroupForConfirmationEmail = async ({ id }: Pick<ReservationGroup, 'id'>) => (await prisma.reservationGroup.findFirst({
  where: { id },
  include: {
    user: true,
    reservations: {
      include: {
        reservable: {
          include: {
            place: true
          }
        }
      }
    }
  }
}));

export const getReservationGroupList = async () => (await prisma.reservationGroup.findMany({
  include: {
    user: true,
    reservations: {
      include: {
        reservable: {
          include: {
            place: {
              include: {
                company: true
              }
            }
          }
        }
      }
    }
  }
}));

export const createReservationGroup = async ({ note, userId }: Pick<ReservationGroup, 'note' | 'userId'>) => (await prisma.reservationGroup.create({
  data: {
    note, userId
  },
}));

export const updateReservationGroup = async ({ id, note, userId }: Pick<ReservationGroup, 'id' | 'note' | 'userId'>) => (await prisma.reservationGroup.update({
  where: {
    id
  },
  data: {
    note, userId
  },
  include: {
    reservations: true
  }
}));

export const deleteReservationGroup = ({ id }: Pick<ReservationGroup, 'id'>) => (prisma.reservationGroup.deleteMany({
    where: { id },
}));
