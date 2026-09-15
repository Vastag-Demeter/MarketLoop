import prisma from "./db.js";

//get the emailTypes
export let EMAIL_TYPES = {};
export const loadEmailTypes = async () => {
  try {
    const foundTypes = await prisma.emailTypes.findMany();
    foundTypes.forEach((type) => {
      EMAIL_TYPES[type.name] = type.id;
    });

    console.log("Loaded email types.");
  } catch (error) {
    console.error(error);
  }
};
