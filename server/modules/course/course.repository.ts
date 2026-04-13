import { prisma } from "#server/lib/prisma";
import type { CourseCreateInput, CourseUpdateInput } from "#server/generated/models";

export const courseRepository = {
    create(data: CourseCreateInput) {
        return prisma.course.create({ data });
    },

    update(id: string, data: CourseUpdateInput) {
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
            include: { teams: true }, // opcional
        });
    },

    delete(id: string) {
        return prisma.course.delete({ where: { id } });
    },
};
