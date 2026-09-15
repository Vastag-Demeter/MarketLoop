//Check if the string is empty
export const isEmptyOrWhiteSpace = (str) => {
  if (typeof str !== "string") {
    return true;
  }
  return str.trim().length === 0;
};

//Iterates trough the given list and checks if the items are empty
export const isEmptyOrWhiteSpaceList = (list) => {
  for (const item of list) {
    if (isEmptyOrWhiteSpace(item)) return true;
  }
  return false;
};

export const isEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateOrderNumber = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${date}-${random}`;
};

export const checkIDList = (list) => {
  for (const item of list) {
    if (!Number.isInteger(parseInt(item))) return false;
  }
  return true;
};
