import type { User, Search } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User, Search } from "@prisma/client";

export const getUser = async ({ id }: Pick<User, 'id'>) => (await prisma.user.findUnique({
  where: { id },
}));

export const getUserId = async ({ username }: Pick<User, 'username'>) => (await prisma.user.findUnique({
  where: { username },
  select: {
    id: true
  }
}));

export const checkForUserByUsername = async ({ username }: Pick<User, 'username'>) => (await prisma.user.findUnique({
  where: { username },
  select: { id: true, passwordHash: true, admin: true, verifiedEmail: true, email: true }
}));

export const getEmailFromUsername = async ({ username }: Pick<User, 'username'>) => (await prisma.user.findUnique({
  where: { username },
  select: { email: true }
}));

export const checkForUserByEmail = async ({ email }: Pick<User, 'email'>) => (await prisma.user.findUnique({
  where: { email },
  select: { id: true, passwordHash: true, admin: true }
}));

export const getUserEmailToResend = async ({ username }: Pick<User, 'username'>) => (await prisma.user.findUnique({
  where: {
    username
  },
  select: { email: true, verifyEmailTriesLeft: true }
}));

export const subtractResendTries = async ({ email }: Pick<User, 'email'>) => (await prisma.user.update({
  where: { email },
  data: {
    verifyEmailTriesLeft: {
      decrement: 1
    }
  }
}));

export const addToSearchHistory = async ({ username, phrase, locationId, tagIds, categoryIds }: Pick<User, 'username'> & Pick<Search, 'phrase' | 'locationId'> & { tagIds: string[], categoryIds: string[] }) => await prisma.user.update({
  where: { username },
  data: {
    searchHistory: {
      create: {
        phrase,
        locationId,
        Tags: {
          connect: tagIds.map(t => ({ id: t }))
        },
        Categories: {
          connect: categoryIds.map(c => ({ id: c }))
        },
      }
    }
  }
});

export const getSearchHistory = async ({ username }: Pick<User, 'username'>) => await prisma.user.findUnique({
  where: { username },
  include: {
    searchHistory: {
      orderBy: [{
        createdAt: 'desc',
      }],
      take: 6,
      include: {
        location: {
          include: {
            multiLangCity: true,
            multiLangCountry: true
          }
        },
        Tags: {
          include: {
            multiLangDesc: true,
            multiLangName: true
          }
        },
        Categories: {
          include: {
            multiLangName: true
          }
        }
      }
    }
  }
})

export const verifyUserEmail = async (email: string) => (await prisma.user.update({
  where: {
    email
  }, data: {
    verifiedEmail: true
  },
  select: {
    username: true, admin: true
  }
}));

export const changeUserPassword = async({ username, passwordHash }: Pick<User, 'username' | 'passwordHash'>) => (await prisma.user.update({
  where: {
    username
  },
  data: {
    passwordHash
  }
}));

export const getUserByUsername = async ({ username }: Pick<User, 'username'>) => (await prisma.user.findUnique({
  where: { username },
  include: {
    reservationGroups: {
      include: {
        reservations: {
          include: {
            reservable: {
              include: {
                place: true,
                ReservableType: {
                  include: {
                    multiLangName: true
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

export const createUser = async ({
  username, passwordHash, email, phone, firstName, lastName
}: Pick<User, 
  'username' | 'passwordHash' | 'email' | 'firstName' | 'lastName' | 'phone'
>) => (await prisma.user.create({
  data: { username, passwordHash, email, phone, firstName, lastName },
  select: { id: true, passwordHash: true }
}));

export const updateUser = async ({ id, firstName, lastName, /*username, email,*/ phone }: Pick<User, 'id' | 'firstName' | 'lastName' | 'phone'/* | 'email' | 'username'*/>) => (await prisma.user.update({
  where: {
    id
  },
  data: {
    /*username, email, */firstName, lastName, phone
  }
}));

export const deleteUser = async ({ id }: Pick<User, 'id'>) => (await prisma.user.deleteMany({
    where: { id },
}));
