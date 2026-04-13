import { prisma } from "#server/lib/prisma";
import type { TeamCreateInput, TeamUpdateInput } from "#server/generated/models";

export const teamRepository = {
    create(data: TeamCreateInput) {
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
            where: { courseId },
            include: { course: true },
        });
    },

    listAll() {
        return prisma.team.findMany({
            include: { course: true },
        });
    },

    update(id: string, data: Partial<TeamUpdateInput>) {
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
