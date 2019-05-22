export const toCamelCase = string => {
  return string
    .replace(/\s(.)/g, function($1) {
      return $1.toUpperCase();
    })
    .replace(/\s/g, "")
    .replace(/^(.)/, function($1) {
      return $1.toLowerCase();
    });
};

export const toUrlFriendlyName = string => {
  let friendlyName = string
    .replace(/[^a-z0-9\s-]/gim, "")
    .replace(/[-]/gim, " ");
  let words = friendlyName.split(/\s+/g);
  friendlyName = words.join("-");
  friendlyName = friendlyName.toLowerCase();
  return friendlyName;
};
