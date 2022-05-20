import type { ReservableType, MultilingualName } from "@prisma/client";

import { prisma } from "~/db.server";

export type { ReservableType } from "@prisma/client";

export const createReservableType = async ({ multiLangName }: { multiLangName: MultilingualName }) => (await prisma.reservableType.create({
  data: {
    multiLangName: {
      create: {
        czech: multiLangName.czech,
        english: multiLangName.english
      }
    }
  },
}));

export const updateReservableType = async ({ id, multiLangName }: { id: string, multiLangName: MultilingualName }) => (await prisma.reservableType.update({
  where: {
    id
  },
  data: {
    multiLangName: {
      update: {
        czech: multiLangName.czech,
        english: multiLangName.english
      }
    }
  },
}));


export const getReservableType = async ({ id }: Pick<ReservableType, 'id'>) => (await prisma.reservableType.findFirst({
  where: { id },
  include: {
    multiLangName: true
  }
}));

export const getReservableTypeList = async ({ nameFragment }: { nameFragment: string }) => (await prisma.reservableType.findMany({
  where: {
    OR: [{
      multiLangName: {
        english: {
          contains: nameFragment ?? '',
          mode: 'insensitive'
        }
      }
    }, {
      multiLangName: {
        czech: {
          contains: nameFragment ?? '',
          mode: 'insensitive'
        }
      }
    }]
  },
  include: {
    multiLangName: true
  }
}));

export const getAllReservableTypes = async () => (await prisma.reservableType.findMany({
  include: {
    multiLangName: true
  }
}));

export const deleteReservableType = ({ id }: Pick<ReservableType, 'id'>) => (prisma.reservableType.deleteMany({
    where: { id },
}));
