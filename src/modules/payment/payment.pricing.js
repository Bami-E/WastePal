export const getPickupPrice = (quantity) => {
  switch (quantity) {
    case 1:
      return 750;

    case 2:
      return 1200;

    case 3:
      return 1600;

    default:
      throw new Error("Invalid bag quantity");
  }
};

export const getPickerPayout = (quantity) => {
  switch (quantity) {
    case 1:
      return 450;

    case 2:
      return 700;

    case 3:
      return 950;

    default:
      throw new Error("Invalid bag quantity");
  }
};