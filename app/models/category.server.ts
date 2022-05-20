import type { Category, MultilingualName } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Category } from "@prisma/client";

export const createCategory = async ({ multiLangName }: { multiLangName: MultilingualName }) => (await prisma.category.create({
  data: {
    multiLangName: {
      create: {
        czech: multiLangName.czech,
        english: multiLangName.english
      }
    }
  },
}));

export const updateCategory = async ({ id, multiLangName }: { id: string, multiLangName: MultilingualName }) => (await prisma.category.update({
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


export const getCategory = async ({ id }: Pick<Category, 'id'>) => (await prisma.category.findFirst({
  where: { id },
  include: {
    places: true,
    multiLangName: true
  }
}));

export const getCategoryList = async ({ nameFragment }: { nameFragment: string }) => (await prisma.category.findMany({
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
    places: true,
    multiLangName: true
  }
}));

export const getAllCategorys = async () => (await prisma.category.findMany({
  include: {
    places: true,
    multiLangName: true
  }
}));

export const deleteCategory = ({ id }: Pick<Category, 'id'>) => (prisma.category.deleteMany({
    where: { id },
}));
