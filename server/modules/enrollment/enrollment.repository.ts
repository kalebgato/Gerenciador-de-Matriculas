import { prisma } from "#server/lib/prisma";

export const enrollmentRepository = {
    create(data: { student_id: string; team_id: string }) {
        return prisma.enrollment.create({ data });
    },

    findByTeamAndStudent(team_id: string, student_id: string) {
        return prisma.enrollment.findUnique({
            where: {
                team_id_student_id: {
                    team_id,
                    student_id,
                },
            },
        });
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
            where: { student_id: studentId },
            include: { team: true }
        });
    },

    listAll() {
        return prisma.enrollment.findMany({
            include: {
                student: true,
                team: true,
            },
        });
    },
};
