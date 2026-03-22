import { enrollmentRepository } from "./enrollment.repository";
import { studentRepository } from "#server/modules/student/student.repository";
import { teamRepository } from "#server/modules/team/team.repository";
import type { EnrollmentCreateInput } from "#server/generated/models";

export const enrollmentService = {
    async enroll(data: { studentId: string; teamId: string }) {
        const { studentId, teamId } = data;

        // Verifica se o aluno existe
        const student = await studentRepository.findById(studentId);
        if (!student) throw new Error("Aluno não encontrado");

        // Verifica se a turma existe
        const team = await teamRepository.findById(teamId);
        if (!team) throw new Error("Turma não encontrada");

        // Cria a matrícula
        const enrollmentData: EnrollmentCreateInput = {
            student: { connect: { id: studentId } },
            team: { connect: { id: teamId } },
            active: true,
        };

        return enrollmentRepository.create(enrollmentData);
    },

    async getById(id: string) {
        const enrollment = await enrollmentRepository.findById(id);
        if (!enrollment) throw new Error("Matrícula não encontrada");
        return enrollment;
    },

    async listByStudent(studentId: string) {
        // Verifica se o aluno existe antes de listar
        const student = await studentRepository.findById(studentId);
        if (!student) throw new Error("Aluno não encontrado");

        return enrollmentRepository.listByStudent(studentId);
    },
};
