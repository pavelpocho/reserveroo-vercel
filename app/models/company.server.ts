import type { Company } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Company } from "@prisma/client";

export const getCompany = async ({ id }: Pick<Company, 'id'>) => (await prisma.company.findFirst({
  where: { id },
  include: {
    places: true
  }
}));

export const getCompanyList = async ({ name: nameFragment }: Pick<Company, 'name'>) => (await prisma.company.findMany({
  where: { name: { contains: nameFragment, mode: 'insensitive' } },
  include: {
    places: true
  }
}));

export const getAllCompanys = async () => (await prisma.company.findMany({
  include: {
    places: true
  }
}));

export const createCompany = async ({ name }: Pick<Company, 'name'>) => (await prisma.company.create({
  data: {
    name
  },
}));

export const updateCompany = async ({ id, name }: Pick<Company, 'id' | 'name'>) => (await prisma.company.update({
  where: {
    id
  },
  data: {
    name
  }
}));

export const deleteCompany = ({ id }: Pick<Company, 'id'>) => (prisma.company.deleteMany({
    where: { id },
}));
