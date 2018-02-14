const year = "([12][0-9]{3})";
const month = "(0[1-9]|1[0-2])";
const day = "([12][0-9]|0[1-9]|3[01])";
const hour = "([01][0-9]|2[0-3])";
const minute = "([0-5][0-9])";
const second = "([0-5][0-9])";
const milli = "([0-9]{3})";

const ISO8601 = `${year}-${month}-${day}T${hour}:${minute}:${second}.${milli}Z`;
const shortTime = `${minute}:${second}`;

export const reMongoId = /^[0-9a-f]{24}$/;
export const reHEXColor = /^#[0-9A-F]{6}$/i;
export const reShortTime = new RegExp(`^${shortTime}$`);
export const reISO8601 = new RegExp(`^${ISO8601}$`);
export const reRange = new RegExp(`^${ISO8601}\\/${ISO8601}$`);
export const rePlate = /([A-Z]{1,2})([0-9]{3,4})([A-Z]{2})/;
export const reEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
