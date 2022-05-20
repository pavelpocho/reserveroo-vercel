import { json } from "@remix-run/node";

export const getDateObjectFromTimeString = (s: string) => {
  return new Date(1, 1, 1, parseInt(s.split(':')[0]) - 1, parseInt(s.split(':')[1]));
}

export const getDayOfWeek = (date: Date) => {
  return date.getDay() == 0 ? 6 : date.getDay() - 1;
}

export const getStringTimeValue = (date: Date): string => {
  const hPrefix = date.getHours() < 10 ? '0' : '';
  const mPrefix = date.getMinutes() < 10 ? '0' : '';
  return `${hPrefix}${date.getHours()}:${mPrefix}${date.getMinutes()}`;
}

export const getStringDateValue = (date: Date): string => {
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

export const getInputDateFromString = (date: Date | null) => (date ?
  `${date.getFullYear()}-${date.getMonth() < 10 ? '0' : ''}${date.getMonth()}-${date.getDate() < 10 ? '0' : ''}${date.getDate()}` : ''
);

export const areDatesEqual = (date1: Date, date2: Date) => (
  date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
)

export const getFormEssentials = async (request: Request) => {
  const form = await request.formData();
  const getFormItem = (key: string) => form.get(key)?.toString() ?? '';
  const getFormItems = (key: string) => form.getAll(key).map(r => r.toString());
  return { form, getFormItem, getFormItems };
}

export const badRequest = <T>(data: T) => json(data, { status: 400 });

export const getBaseUrl = (request: Request) => request.url.split('/').slice(0, 3).join('/');

export const isValidEmail = (email: string) => {
  return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    .test(email);
}

export const isValidPhone = (phone: string) => {
  return /\+?[0-9 ()-]{3,15}/g.test(phone);
}


