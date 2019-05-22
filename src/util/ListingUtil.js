import moment from "moment";

export const isCurrentlyOpen = listing => {
  if (!listing.hours) {
    return false;
  }

  const now = moment();
  const dayOfWeek = now.format("dddd").toLowerCase();
  const listingDay = listing.hours[dayOfWeek];

  if (!listingDay.open) {
    return false;
  }
  const from = moment(listingDay.from);
  const to = moment(listingDay.to);

  const m1 = moment()
    .set("hour", from.hour())
    .set("minute", from.minute())
    .set("second", 0);
  const m2 = moment()
    .set("hour", to.hour())
    .set("minute", to.minute())
    .set("second", 0);

  const isBetween = now.isBetween(m1, m2);

  return isBetween;
};
