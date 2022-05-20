import type { Location, MultilingualDesc, MultilingualName } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Location } from "@prisma/client";

export const createLocation = async ({ multiLangCity, multiLangCountry }: { multiLangCountry: MultilingualName, multiLangCity: MultilingualDesc }) => (await prisma.location.create({
  data: {
    multiLangCity: {
      create: {
        czech: multiLangCity.czech,
        english: multiLangCity.english
      }
    },
    multiLangCountry: {
      create: {
        czech: multiLangCountry.czech,
        english: multiLangCountry.english
      }
    },
    cityCountry: multiLangCity.english + multiLangCountry.english
  },
}));

export const updateLocation = async ({ id, multiLangCity, multiLangCountry }: { id: string, multiLangCountry: MultilingualName, multiLangCity: MultilingualDesc }) => (await prisma.location.update({
  where: {
    id
  },
  data: {
    multiLangCity: {
      update: {
        czech: multiLangCity.czech,
        english: multiLangCity.english
      }
    },
    multiLangCountry: {
      update: {
        czech: multiLangCountry.czech,
        english: multiLangCountry.english
      }
    },
    cityCountry: multiLangCity.english + multiLangCountry.english
  },
}));

export const getLocation = async ({ id }: Pick<Location, 'id'>) => (await prisma.location.findFirst({
  where: { id },
  include: {
    places: true,
    multiLangCity: true,
    multiLangCountry: true
  }
}));

export const getLocationByName = async ({ cityCountry }: Pick<Location, 'cityCountry'>) => (await prisma.location.findFirst({
  where: { cityCountry },
  include: {
    places: true,
    multiLangCity: true,
    multiLangCountry: true
  }
}));

export const getLocationList = async ({ cityCountry: nameFragment }: Pick<Location, 'cityCountry'>) => (await prisma.location.findMany({
  // TODO: Get this to work in multiple languages
  // (not needed for now because there will be like 1 location)
  where: { cityCountry: { contains: nameFragment, mode: 'insensitive' } },
  include: {
    places: true,
    multiLangCity: true,
    multiLangCountry: true
  }
}));

export const getAllLocations = async () => (await prisma.location.findMany({
  include: {
    places: true,
    multiLangCity: true,
    multiLangCountry: true
  }
}));

export const deleteLocation = ({ id }: Pick<Location, 'id'>) => (prisma.location.deleteMany({
    where: { id },
}));
