import { prisma } from "#server/lib/prisma";

export const courseRepository = {
    create(data: { title: string; active?: boolean }) {
        return prisma.course.create({ data });
    },

    update(id: string, data: { title?: string; active?: boolean }) {
        return prisma.course.update({
            where: { id },
            data,
        });
    },

    findById(id: string) {
        return prisma.course.findUnique({
            where: { id },
            include: { teams: true } // opcional: incluir turmas do curso
        });
    },

    list() {
        return prisma.course.findMany({
            include: { teams: true },
        });
    },

    delete(id: string) {
        return prisma.course.delete({ where: { id } });
    },
};
