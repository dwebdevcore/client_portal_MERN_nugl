const types = {
  DISPENSARY: "Dispensary",
  RETAIL: "Retail",
  SERVICE: "Service",
  BRAND: "Brand",
  CHURCH: "Church"
};

export const Subtypes = [
  {
    type: types.DISPENSARY,
    subtypes: ["Store Front", "Delivery", "Online Shop"]
  },
  {
    type: types.RETAIL,
    subtypes: ["Head Shop", "Hydro Shop"]
  },
  {
    type: types.CHURCH,
    subtypes: ["Store Front", "Delivery", "Online Shop"]
  },
  {
    type: types.SERVICE,
    subtypes: [
      "Architect",
      "Association",
      "Construction",
      "Consultant",
      "CPA",
      "Distributor",
      "Doctor",
      "Investor",
      "Lawyer",
      "Lobbiest",
      "Magazine",
      "Manufacturer",
      "Marketing",
      "Security",
      "Testing Lab"
    ]
  }
];

export default {
  ...types
};
