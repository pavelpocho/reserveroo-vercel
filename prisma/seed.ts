import { Company, CompanyIdentity, OpeningTime, Place, PrismaClient, Reservation, ReservationGroup } from "@prisma/client";
import { checkPassword, generateHashAndSalt } from "~/utils/pwd_helper.server";

const prisma = new PrismaClient();

const seed = async () => {

  await cleanUp();

  const companyIdentities = await generateCompanyIdentities();

  const users = await generateUsers();

  const createdCompanies = await Promise.all(
    companies.map(c => {
      return prisma.company.create({ data: c });
    })
  );

  const createdCompanyIdentities = await Promise.all(
    companyIdentities.map((cI, i) => {
      return prisma.companyIdentity.create({ data: {
        companyId: createdCompanies[i].id,
        ...cI
      }})
    })
  )

  const createdUsers = await Promise.all(
    users.map(u => {
      return prisma.user.create({ data: u })
    })
  );

  const createdPlaces = await Promise.all(
    places.map((p, i) => {
      return prisma.place.create({ data: {
        companyId: createdCompanies[i].id,
        ...p
      } })
    })
  )

  let openingTimePromises: Promise<OpeningTime>[] = [];

  createdPlaces.forEach(p => {
    openingTimePromises.push(...[...Array(7).keys()].map(d => {
      const open = new Date();
      open.setHours(8, 30);
      const close = new Date();
      close.setHours(17);
      return prisma.openingTime.create({
        data: {
          day: d,
          open: open,
          close: close,
          placeId: p.id
        }
      })
    }))
  })

  await Promise.all(openingTimePromises);

  const createdReservables = await Promise.all(
    reservables.map((r, i) => {
      return prisma.reservable.create({ data: {
        placeId: createdPlaces[i].id,
        ...r
      } })
    })
  )

  const createdReservationGroups = await Promise.all(
    reservationGroups.map((r, i) => {
      return prisma.reservationGroup.create({ data: {
        userId: createdUsers[i].id,
        ...r
      }})
    })
  )

  const createdReservations = await Promise.all(
    reservations.map((r, i) => {
      return prisma.reservation.create({ data: {
        ...r,
        reservableId: createdReservables[i].id,
        reservationGroupId: createdReservationGroups[i].id
      } })
    })
  )

  console.log(`Database has been seeded. 🌱`);

}

const generateCompanyIdentities = async () => {
  return [{
    email: 'main@courts.com',
    username: 'maincourts',
    passwordHash: await generateHashAndSalt('johnspwd'),
  }, {
    email: 'main@bowling.com',
    username: 'mainbowling',
    passwordHash: await generateHashAndSalt('peterspwd'),
  }, {
    email: 'main@sports.com',
    username: 'mainsports',
    passwordHash: await generateHashAndSalt('louisspwd')
  }]
}

const generateUsers = async () => {
  return [{
    email: 'admin@admin.com',
    username: 'admin',
    phone: '+123456789123',
    firstName: 'Admin',
    lastName: 'Administrator',
    admin: true,
    passwordHash: await generateHashAndSalt('reserveroo')
  }, {
    email: 'john@person.com',
    username: 'john123',
    phone: '+234567891234',
    firstName: 'John',
    lastName: 'Newman',
    admin: false,
    passwordHash: await generateHashAndSalt('johnspwd')
  }, {
    email: 'peter@person.com',
    username: 'peter123',
    phone: '+345678912345',
    firstName: 'Peter',
    lastName: 'Parker',
    admin: false,
    passwordHash: await generateHashAndSalt('peterspwd')
  }, {
    email: 'louis@person.com',
    username: 'louis123',
    phone: '+456789123456',
    firstName: 'Louis',
    lastName: 'Litt',
    admin: false,
    passwordHash: await generateHashAndSalt('louisspwd')
  }]
}

const companies: Pick<Company, 'name'>[] = [{
  name: 'Tennis courts ltd.'
}, {
  name: 'Bars and bowlings LLC'
}, {
  name: 'Sports venues inc.'
}]

const places: Pick<Place, 'name'>[] = [{
  name: 'Tennis'
}, {
  name: 'Biliard bar'
}, {
  name: 'Badminton'
}]

const reservations: Pick<Reservation, 'start' | 'end'>[] = [{
  start: new Date(2022, 4, 10, 10, 30),
  end: new Date(2022, 4, 10, 11, 30)
}, {
  start: new Date(2022, 4, 10, 9, 0),
  end: new Date(2022, 4, 10, 11, 0)
}, {
  start: new Date(2022, 4, 10, 10, 0),
  end: new Date(2022, 4, 10, 10, 30)
}]

const reservables: Pick<Place, 'name'>[] = [{
  name: 'Tennis court'
}, {
  name: 'Biliard table'
}, {
  name: 'Badminton court'
}]

const reservationGroups: Pick<ReservationGroup, 'note'>[] = [{
  note: 'pls i want'
}, {
  note: 'yeeeeeeet'
}, {
  note: 'reserveroo is the best yo'
}]

const cleanUp = async () => {
  // cleanup the existing database
  await prisma.reservation.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.place.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.user.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.companyIdentity.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.company.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.category.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.tag.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.location.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.openingTime.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.reservable.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.reservationGroup.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
