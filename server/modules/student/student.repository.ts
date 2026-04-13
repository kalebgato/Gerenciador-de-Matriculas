import { prisma } from "#server/lib/prisma";
import type { StudentCreateInput, StudentUncheckedCreateInput, StudentUpdateInput, StudentUncheckedUpdateInput, StudentWhereInput } from "#server/generated/models";

export const studentRepository = {
    create(data: StudentCreateInput) {
        return prisma.student.create({ data });
    },

    createUnchecked(data: StudentUncheckedCreateInput) {
        return prisma.student.create({ data });
    },

    findByCPF(cpf: string) {
        return prisma.student.findUnique({
            where: { cpf },
        });
    },

    findById(id: string) {
        return prisma.student.findUnique({
            where: { id },
        });
    },

    list() {
        return prisma.student.findMany();
    },

    update(id: string, data: StudentUpdateInput) {
        return prisma.student.update({
            where: { id },
            data,
        });
    },

    updateUnchecked(id: string, data: StudentUncheckedUpdateInput) {
        return prisma.student.update({
            where: { id },
            data,
        });
    },

    delete(id: string) {
        return prisma.student.delete({
            where: { id },
        });
    },

    count(where?: StudentWhereInput) {
        return prisma.student.count({ where });
    },
  };
