import { SendEmailRequest } from "@aws-sdk/client-ses";
import { ses } from "~/db.server";
import { Place } from "~/models/place.server";
import { ReservationStatus } from "~/types/types";
import { signMessage } from "./signing.server";


export const sendEmailConfirmationEmail = async (sendToAddress: string, baseUrl: string) => {

  const msg = sendToAddress;
  const signature = signMessage(msg);

  const emailParams: SendEmailRequest = {
    Source: 'reserveroo@reserveroo.com',
    Destination: {
      ToAddresses: [
        // sendToAddress
        'success@simulator.amazonses.com'
      ]
    },
    Message: {
      Subject: {
        Data: 'Reserveroo - Verify Email Address',
        Charset: 'UTF-8'
      },
      Body: {
        Text: {
          Data: 'Click the link to verify: ',
          Charset: 'UTF-8'
        }
      }
    }
  }

  console.log("Link that would otherwise be in email:");
  console.log(`${baseUrl}/verifyEmail?verifyToken=${msg}:${signature}`);
  const response = await ses.sendEmail(emailParams);
}

export const sendPwdResetEmail = async (sendToAddress: string, baseUrl: string, msg: string) => {

  const signature = signMessage(msg);

  const emailParams: SendEmailRequest = {
    Source: 'reserveroo@reserveroo.com',
    Destination: {
      ToAddresses: [
        // sendToAddress
        'success@simulator.amazonses.com'
      ]
    },
    Message: {
      Subject: {
        Data: 'Reserveroo - Password Reset',
        Charset: 'UTF-8'
      },
      Body: {
        Text: {
          Data: 'Click the link to reset: ',
          Charset: 'UTF-8'
        }
      }
    }
  }

  console.log("Link that would otherwise be in email:");
  console.log(`${baseUrl}/pwd/reset?token=${msg}:${signature}`);
  const response = await ses.sendEmail(emailParams);
}

export const sendCreationEmail = async (username: string) => {

  const emailParams: SendEmailRequest = {
    Source: 'reserveroo@reserveroo.com',
    Destination: {
      ToAddresses: [
        // 'pavlik.pocho@gmail.com', 'loskotaklp@gmail.com', 'tomasekerbenu@gmail.com'
        'success@simulator.amazonses.com'
      ]
    },
    Message: {
      Subject: {
        Data: `Reserveroo - New Reservation!!`,
        Charset: 'UTF-8'
      },
      Body: {
        Text: {
          Data: `${username} created a new reservation!!`,
          Charset: 'UTF-8'
        }
      }
    }
  }

  console.log("Sent creation email to all of us.");
  const response = await ses.sendEmail(emailParams);
}

export const sendCancellationEmail = async () => {

  const emailParams: SendEmailRequest = {
    Source: 'reserveroo@reserveroo.com',
    Destination: {
      ToAddresses: [
        // 'pavlik.pocho@gmail.com', 'loskotaklp@gmail.com', 'tomasekerbenu@gmail.com'
        'success@simulator.amazonses.com'
      ]
    },
    Message: {
      Subject: {
        Data: `Reserveroo - CANCELLED Reservation!!`,
        Charset: 'UTF-8'
      },
      Body: {
        Text: {
          Data: `A reservation was just cancelled by a user.`,
          Charset: 'UTF-8'
        }
      }
    }
  }

  console.log("Sent cancellation email to all of us.");
  const response = await ses.sendEmail(emailParams);
}

export const sendStatusUpdateEmail = async (sendToAddress: string, status: ReservationStatus, place: Place, start: Date) => {

  const emailParams: SendEmailRequest = {
    Source: 'reserveroo@reserveroo.com',
    Destination: {
      ToAddresses: [
        // sendToAddress
        'success@simulator.amazonses.com'
      ]
    },
    Message: {
      Subject: {
        Data: `Reserveroo - Reservation ${status == ReservationStatus.Cancelled ? 'Cancelled' : status == ReservationStatus.Confirmed ? 'Confirmed' : ''}`,
        Charset: 'UTF-8'
      },
      Body: {
        Text: {
          Data: `Your reservation at ${place} for ${new Date(start).getDate()} ${
            status == ReservationStatus.Cancelled ? 'could not be created. The selected timeslot isn\'t available' :
            status == ReservationStatus.Confirmed ? 'is CONFIRMED. Thank you for booking with us!' : ''
          }`,
          Charset: 'UTF-8'
        }
      }
    }
  }

  console.log("Sent confirmation / rejection email to " + sendToAddress);
  const response = await ses.sendEmail(emailParams);
}