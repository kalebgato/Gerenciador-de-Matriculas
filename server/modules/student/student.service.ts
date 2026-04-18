import { studentRepository } from "./student.repository";

export const studentService = {
    async create(data: {
        name: string;
        cpf: string;
        email?: string;
        dn?: Date;
        phone?: string;
        responsable_name?: string;
        responsable_phone?: string;
        active?: boolean;
    }) {
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

    async update(id: string, data: {
        name?: string;
        cpf?: string;
        email?: string;
        dn?: Date;
        phone?: string;
        responsable_name?: string;
        responsable_phone?: string;
        active?: boolean;
    }) {
        const student = await studentRepository.findById(id);
        if (!student) {
            throw new Error("Aluno não encontrado");
        }

        if (data.cpf && data.cpf !== student.cpf) {
            const existingStudent = await studentRepository.findByCPF(data.cpf);
            if (existingStudent) {
                throw new Error("CPF já cadastrado");
            }
        }

        return studentRepository.update(id, data);
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
