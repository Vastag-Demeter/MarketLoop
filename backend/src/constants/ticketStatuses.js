import prisma from "./db.js";

//get the ticket statuses
export let STATUSES = {};
export const loadStatuses = async () => {
  try {
    const foundStatuses = await prisma.supportTicketStatuses.findMany();
    foundStatuses.forEach((status) => {
      STATUSES[status.name] = status.id;
    });
    console.log("Loaded ticket statuses.");
  } catch (error) {
    console.error(error);
  }
};
