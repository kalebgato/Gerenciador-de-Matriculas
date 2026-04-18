import { prisma } from "#server/lib/prisma";

export const studentRepository = {
    create(data: {
        name: string;
        cpf: string;
        email?: string;
        dn?: Date;
        phone?: string;
        responsable_name?: string;
        responsable_phone?: string;
        active?: boolean;
    }) {
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

    update(id: string, data: {
        name?: string;
        cpf?: string;
        email?: string;
        dn?: Date;
        phone?: string;
        responsable_name?: string;
        responsable_phone?: string;
        active?: boolean;
    }) {
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

    count(where?: { active?: boolean; cpf?: string }) {
        return prisma.student.count({ where });
    },
  };
