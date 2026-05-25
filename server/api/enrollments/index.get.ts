import { prisma } from "../../lib/prisma";

export default defineEventHandler(async () => {
  const enrollments = await prisma.enrollment.findMany({
    include: {
      student: true,
      team: true,
      charges: true,
    },
  });

  return enrollments;
});