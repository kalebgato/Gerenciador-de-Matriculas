import { prisma } from "#server/lib/prisma";

export const teamRepository = {
    create(data: {
        course_id: string;
        title: string;
        team_leader_id?: string;
        start_date?: Date;
        end_date?: Date;
        horary?: string;
        days_of_week?: string;
        active?: boolean;
        payment_date?: Date;
        price: number;
    }) {
        return prisma.team.create({ data });
    },

    findById(id: string) {
        return prisma.team.findUnique({
            where: { id },
            include: { course: true }, // inclui o curso associado
        });
    },

    listByCourse(courseId: string) {
        return prisma.team.findMany({
            where: { course_id: courseId },
            include: { course: true },
        });
    },

    listAll() {
        return prisma.team.findMany({
            include: { course: true },
        });
    },

    update(id: string, data: {
        title?: string;
        team_leader_id?: string;
        start_date?: Date;
        end_date?: Date;
        horary?: string;
        days_of_week?: string;
        active?: boolean;
        payment_date?: Date;
        price?: number;
    }) {
        return prisma.team.update({
            where: { id },
            data,
        });
    },

    delete(id: string) {
        return prisma.team.delete({
            where: { id },
        });
    },
};
