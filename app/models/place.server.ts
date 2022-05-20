import type { Place } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Place } from "@prisma/client";

export const getPlace = async ({ id }: Pick<Place, 'id'>) => (await prisma.place.findFirst({
  where: { id },
  include: {
    reservables: {
      include: {
        ReservableType: {
          include: {
            multiLangName: true
          }
        }
      }
    },
    openingTimes: true,
    tags: {
      include: {
        multiLangName: true,
        multiLangDesc: true
      }
    },
    categories: {
      include: {
        multiLangName: true
      }
    },
    Location: {
      include: {
        multiLangCountry: true,
        multiLangCity: true
      }
    }
  }
}));

export const getPlaceWithReservations = async ({ id }: Pick<Place, 'id'>) => (await prisma.place.findFirst({
  where: { id },
  include: {
    reservables: {
      include: {
        reservations: true,
        ReservableType: {
          include: {
            multiLangName: true
          }
        }
      }
    },
    openingTimes: true
  }
}));

export const getPlaceList = async ({ name: nameFragment, cityCountry, tagIds, catIds }: Pick<Place, 'name'> & { cityCountry: string | undefined, tagIds: string[], catIds: string[] }) => (await prisma.place.findMany({
  where: { 
    AND: [{
      name: {
        contains: nameFragment, mode: 'insensitive',
      }
    }, {
      hidden: false,
    }, {
      Location: {
        cityCountry
      }
    }, {
      OR: tagIds?.map(t => ({
        tags: {
          some: {
            id: t
          }
        }
      }))
    }, {
      OR: catIds?.map(c => ({
        categories: {
          some: {
            id: c
          }
        }
      }))
    }]
  },
  include: {
    openingTimes: true,
    company: true,
    reservables: {
      include: {
        ReservableType: {
          include: {
            multiLangName: true
          }
        }
      }
    },
    tags: {
      include: {
        multiLangDesc: true,
        multiLangName: true
      }
    },
    categories: {
      include: {
        multiLangName: true
      }
    },
    Location: {
      include: {
        multiLangCountry: true,
        multiLangCity: true
      }
    }
  }
}));

export const getNewPlaces = async () => (await prisma.place.findMany({
  orderBy: [{
    createdAt: 'desc',
  }],
  take: 6,
  include: {
    openingTimes: true,
    company: true,
    reservables: {
      include: {
        ReservableType: {
          include: {
            multiLangName: true
          }
        }
      }
    },
    tags: {
      include: {
        multiLangDesc: true,
        multiLangName: true
      }
    },
    categories: {
      include: {
        multiLangName: true
      }
    },
    Location: {
      include: {
        multiLangCountry: true,
        multiLangCity: true
      }
    }
  }
}));

export const getAllPlaces = async () => (await prisma.place.findMany({
  include: {
    company: true,
    reservables: true
  }
}));

export const createPlace = async ({ name, companyId }: Pick<Place, 'name' | 'companyId'>) => (await prisma.place.create({
  data: {
    name,
    companyId
  },
}));

export const updatePlace = async ({
  id, name, companyId, hidden, addedTagIds, removedTagIds, addedCategoryIds, removedCategoryIds, locationId, description,
  street, city, postCode, howToGetThere
}: Pick<Place, 'id' | 'name' | 'companyId' | 'hidden' | 'description' | 'street' | 'city' | 'postCode' | 'howToGetThere'> & {
  addedTagIds: string[],
  removedTagIds: string[],
  addedCategoryIds: string[],
  removedCategoryIds: string[],
  locationId: string
}) => (await prisma.place.update({
  where: {
    id
  },
  data: {
    tags: {
      connect: addedTagIds.map(t => ({ id: t })),
      disconnect: removedTagIds.map(t => ({ id: t }))
    },
    categories: {
      connect: addedCategoryIds.map(c => ({ id: c })),
      disconnect: removedCategoryIds.map(c => ({ id: c }))
    },
    locationId: locationId == '' ? null : locationId, name, companyId, hidden, description,
    street, city, postCode, howToGetThere
  }
}));

export const updatePlaceProfilePic = async ({ id, profilePicUrl }: Pick<Place, 'profilePicUrl' | 'id'>) => await prisma.place.update({
  where: {
    id
  },
  data: {
    profilePicUrl
  }
});

export const addToPlaceGalleryPics = async ({ id, galleryPicUrls }: Pick<Place, 'galleryPicUrls' | 'id'>) => {
  const place = await prisma.place.findUnique({ where: { id } });
  return await prisma.place.update({
    where: {
      id
    },
    data: {
      galleryPicUrls: place?.galleryPicUrls.concat(galleryPicUrls)
    }
  })
};

export const removeFromPlaceGalleryPics = async ({ id, galleryPicUrls }: Pick<Place, 'galleryPicUrls' | 'id'>) => {
  const place = await prisma.place.findUnique({ where: { id } });
  return await prisma.place.update({
    where: {
      id
    },
    data: {
      galleryPicUrls: place?.galleryPicUrls.filter(p1 => !galleryPicUrls.find(p2 => p1 == p2))
    }
  })
};

export const deletePlace = ({ id }: Pick<Place, 'id'>) => (prisma.place.deleteMany({
    where: { id },
}));
