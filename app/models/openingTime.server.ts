import type { OpeningTime } from "@prisma/client";

import { prisma } from "~/db.server";

export type { OpeningTime } from "@prisma/client";

export const getOpeningTime = async ({ id }: Pick<OpeningTime, 'id'>) => (await prisma.openingTime.findFirst({
  where: { id },
}));

export const getOpeningTimeList = async () => (await prisma.openingTime.findMany({
}));

export const createOpeningTime = async ({ placeId, day, open, close }: Pick<OpeningTime, 'open' | 'close' | 'day' | 'placeId'>) => (await prisma.openingTime.create({
  data: {
    placeId, day, open, close
  },
}));

export const updateOpeningTime = async ({ id, open, close }: Pick<OpeningTime, 'id' | 'open' | 'close'>) => (await prisma.openingTime.update({
  where: {
    id
  },
  data: {
    open, close
  },
}));

export const deleteOpeningTime = ({ id }: Pick<OpeningTime, 'id'>) => (prisma.openingTime.deleteMany({
    where: { id },
}));
