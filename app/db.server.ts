import { SES } from "@aws-sdk/client-ses";
import AWS from 'aws-sdk';
import { PrismaClient } from "@prisma/client";
import invariant from "tiny-invariant";

let prisma: PrismaClient;
let ses: SES;
let s3: AWS.S3;

AWS.config.update({
  accessKeyId: process.env.AWS_EMAIL_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_EMAIL_SECRET_ACCESS_KEY
})

declare global {
  var __db__: PrismaClient;
  var __ses__: SES;
  var __s3__: AWS.S3;
}

if (!process.env.AWS_EMAIL_ACCESS_KEY_ID || !process.env.AWS_EMAIL_SECRET_ACCESS_KEY) {
  throw Error("No email credentials");
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === "production") {
  prisma = getClient();
  ses = new SES({
    region: 'eu-west-2',
    credentials: {
      accessKeyId: process.env.AWS_EMAIL_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_EMAIL_SECRET_ACCESS_KEY
    }
  });
  s3 = new AWS.S3();
} else {
  if (!global.__db__) {
    global.__db__ = getClient();
    global.__ses__ = new SES({
      region: 'eu-west-2',
      credentials: {
        accessKeyId: process.env.AWS_EMAIL_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_EMAIL_SECRET_ACCESS_KEY
      }
    });
    global.__s3__ = s3 = new AWS.S3();
  }
  prisma = global.__db__;
  ses = global.__ses__;
  s3 = global.__s3__;
}

function getClient() {
  const { DATABASE_URL } = process.env;
  invariant(typeof DATABASE_URL === "string", "DATABASE_URL env var not set");

  const databaseUrl = new URL(DATABASE_URL);

  // const isLocalHost = databaseUrl.hostname === "localhost";

  // const PRIMARY_REGION = isLocalHost ? null : process.env.PRIMARY_REGION;
  // const FLY_REGION = isLocalHost ? null : process.env.FLY_REGION;

  // const isReadReplicaRegion = !PRIMARY_REGION || PRIMARY_REGION === FLY_REGION;

  // if (!isLocalHost) {
  //   databaseUrl.host = `${FLY_REGION}.${databaseUrl.host}`;
  //   if (!isReadReplicaRegion) {
  //     // 5433 is the read-replica port
  //     databaseUrl.port = "5432";
  //   }
  // }

  console.log(`🔌 setting up prisma client to ${databaseUrl.host}`);
  // NOTE: during development if you change anything in this function, remember
  // that this only runs once per server restart and won't automatically be
  // re-run per request like everything else is. So if you need to change
  // something in this file, you'll need to manually restart the server.
  const client = new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL,
      },
    },
  });
  // connect eagerly
  client.$connect();

  return client;
}

export { prisma, ses, s3 };
