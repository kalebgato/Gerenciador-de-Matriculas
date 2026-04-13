import { teamRepository } from "./team.repository";
import { courseRepository } from "#server/modules/course/course.repository"; 
import type { TeamCreateInput, TeamUpdateInput } from "#server/generated/models";

export const teamService = {
    async create(data: { name: string; schedule?: string; price: number; courseId: string }) {
        const { name, schedule, price, courseId } = data;

        // Verifica se o curso existe
        const course = await courseRepository.findById(courseId);
        if (!course) throw new Error("Curso não encontrado");

        const teamData: TeamCreateInput = {
            name,
            schedule,
            course: { connect: { id: courseId } },
        };

        return teamRepository.create(teamData);
    },

    async getById(id: string) {
        const team = await teamRepository.findById(id);
        if (!team) throw new Error("Turma não encontrada");
        return team;
    },

    async listByCourse(courseId: string) {
        // Verifica se o curso existe
        const course = await courseRepository.findById(courseId);
        if (!course) throw new Error("Curso não encontrado");

        return teamRepository.listByCourse(courseId);
    },

    async listAll() {
        return teamRepository.listAll();
    },

    async update(id: string, data: Partial<TeamUpdateInput>) {
        // Não atualiza courseId por enquanto
        return teamRepository.update(id, data);
    },

    async delete(id: string) {
        return teamRepository.delete(id);
    },
};
