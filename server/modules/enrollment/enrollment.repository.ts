import { prisma } from "#server/lib/prisma";

export const enrollmentRepository = {
    create(data: { student_id: string; team_id: string }) {
        return prisma.enrollment.create({ data });
    },

    update(id: string, data: { team_id?: string }) {
        return prisma.enrollment.update({
            where: { id },
            data,
            include: {
                student: true,
                team: {
                    include: { course: true },
                },
            },
        });
    },

    delete(id: string) {
        return prisma.enrollment.delete({
            where: { id },
            include: {
                student: true,
                team: {
                    include: { course: true },
                },
            },
        });
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

    findByStudentAndCourse(student_id: string, course_id: string) {
        return prisma.enrollment.findFirst({
            where: {
                student_id,
                team: {
                    course_id,
                },
            },
            include: {
                team: {
                    include: { course: true },
                },
            },
        });
    },

    findById(id: string) {
        return prisma.enrollment.findUnique({
            where: { id },
            include: {
                student: true,
                team: {
                    include: { course: true },
                },
            },
        });
    },

    listByStudent(studentId: string) {
        return prisma.enrollment.findMany({
            where: { student_id: studentId },
            include: {
                team: {
                    include: { course: true },
                },
            },
        });
    },

    listAll() {
        return prisma.enrollment.findMany({
            include: {
                student: true,
                team: {
                    include: { course: true },
                },
            },
        });
    },
};
