import { prisma } from "#server/lib/prisma";
import type { EnrollmentCreateInput } from "#server/generated/models";

export const enrollmentRepository = {
    create(data: EnrollmentCreateInput) {
        return prisma.enrollment.create({ data });
    },

    findById(id: string) {
        return prisma.enrollment.findUnique({
            where: { id },
            include: {
                student: true,
                team: true 
            }
        });
    },

    listByStudent(studentId: string) {
        return prisma.enrollment.findMany({
            where: { studentId },
            include: { team: true }
        });
    }
};
