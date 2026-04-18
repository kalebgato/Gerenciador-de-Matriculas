import { enrollmentRepository } from "./enrollment.repository";
import { studentRepository } from "#server/modules/student/student.repository";
import { teamRepository } from "#server/modules/team/team.repository";

export const enrollmentService = {
    async enroll(data: { student_id: string; team_id: string }) {
        const { student_id, team_id } = data;

        const student = await studentRepository.findById(student_id);
        if (!student) throw new Error("Aluno não encontrado");

        const team = await teamRepository.findById(team_id);
        if (!team) throw new Error("Turma não encontrada");

        const existingEnrollment = await enrollmentRepository.findByTeamAndStudent(team_id, student_id);
        if (existingEnrollment) throw new Error("Aluno já matriculado nesta turma");

        return enrollmentRepository.create({ student_id, team_id });
    },

    async getById(id: string) {
        const enrollment = await enrollmentRepository.findById(id);
        if (!enrollment) throw new Error("Matrícula não encontrada");
        return enrollment;
    },

    async listByStudent(studentId: string) {
        const student = await studentRepository.findById(studentId);
        if (!student) throw new Error("Aluno não encontrado");

        return enrollmentRepository.listByStudent(studentId);
    },

    async listAll() {
        return enrollmentRepository.listAll();
    },
};
