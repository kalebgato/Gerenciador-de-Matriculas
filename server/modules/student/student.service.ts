import { studentRepository } from "./student.repository";
import type {
    StudentCreateInput,
    StudentUpdateInput,
    StudentUncheckedUpdateInput,
} from "#server/generated/models";

export const studentService = {
    async create(data: StudentCreateInput) {
        const exists = await studentRepository.findByCPF(data.cpf);

        if (exists) {
            throw new Error("Aluno já cadastrado");
        }

        return studentRepository.create(data);
    },

    async list() {
        return studentRepository.list();
    },

    async findById(id: string) {
        const student = await studentRepository.findById(id);
        if (!student) {
            throw new Error("Aluno não encontrado");
        }
        return student;
    },

    async update(id: string, data: StudentUpdateInput | StudentUncheckedUpdateInput) {
        const student = await studentRepository.findById(id);
        if (!student) {
            throw new Error("Aluno não encontrado");
        }

        // Aqui você pode decidir se usa update ou updateUnchecked dependendo do tipo de data
        return studentRepository.update(id, data as StudentUpdateInput);
    },

    async delete(id: string) {
        const student = await studentRepository.findById(id);
        if (!student) {
            throw new Error("Aluno não encontrado");
        }

        return studentRepository.delete(id);
    },

    async count(where?: Parameters<typeof studentRepository.count>[0]) {
        return studentRepository.count(where);
    },
};
