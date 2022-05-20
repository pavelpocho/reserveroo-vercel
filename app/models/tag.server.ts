import type { MultilingualDesc, MultilingualName, Tag } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Tag } from "@prisma/client";

export const createTag = async ({ multiLangName, multiLangDesc }: { multiLangName: MultilingualName, multiLangDesc: MultilingualDesc }) => (await prisma.tag.create({
  data: {
    multiLangDesc: {
      create: {
        czech: multiLangDesc.czech,
        english: multiLangDesc.english
      }
    },
    multiLangName: {
      create: {
        czech: multiLangName.czech,
        english: multiLangName.english
      }
    }
  },
}));

export const updateTag = async ({ id, multiLangName, multiLangDesc }: { id: string, multiLangName: MultilingualName, multiLangDesc: MultilingualDesc }) => (await prisma.tag.update({
  where: {
    id
  },
  data: {
    multiLangDesc: {
      update: {
        czech: multiLangDesc.czech,
        english: multiLangDesc.english
      }
    },
    multiLangName: {
      update: {
        czech: multiLangName.czech,
        english: multiLangName.english
      }
    }
  },
}));

export const getTag = async ({ id }: Pick<Tag, 'id'>) => (await prisma.tag.findFirst({
  where: { id },
  include: {
    places: true,
    multiLangName: true,
    multiLangDesc: true
  }
}));

export const getTagList = async ({ nameFragment }: { nameFragment: string }) => (await prisma.tag.findMany({
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
    multiLangName: true,
    multiLangDesc: true
  }
}));

export const getAllTags = async () => (await prisma.tag.findMany({
  include: {
    places: true,
    multiLangName: true,
    multiLangDesc: true
  }
}));



export const deleteTag = ({ id }: Pick<Tag, 'id'>) => (prisma.tag.deleteMany({
    where: { id },
}));
