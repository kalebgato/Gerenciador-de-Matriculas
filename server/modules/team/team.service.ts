import { teamRepository } from "./team.repository";
import { courseRepository } from "#server/modules/course/course.repository"; 

export const teamService = {
    async create(data: {
        course_id: string;
        title: string;
        team_leader_id?: string;
        start_date?: Date;
        end_date?: Date;
        horary?: string;
        days_of_week?: string;
        active?: boolean;
        payment_date?: Date;
        price: number;
    }) {
        const { course_id } = data;

        const course = await courseRepository.findById(course_id);
        if (!course) throw new Error("Curso não encontrado");

        return teamRepository.create(data);
    },

    async getById(id: string) {
        const team = await teamRepository.findById(id);
        if (!team) throw new Error("Turma não encontrada");
        return team;
    },

    async listByCourse(courseId: string) {
        const course = await courseRepository.findById(courseId);
        if (!course) throw new Error("Curso não encontrado");

        return teamRepository.listByCourse(courseId);
    },

    async listAll() {
        return teamRepository.listAll();
    },

    async update(id: string, data: {
        title?: string;
        team_leader_id?: string;
        start_date?: Date;
        end_date?: Date;
        horary?: string;
        days_of_week?: string;
        active?: boolean;
        payment_date?: Date;
        price?: number;
    }) {
        const team = await teamRepository.findById(id);
        if (!team) throw new Error("Turma não encontrada");

        return teamRepository.update(id, data);
    },

    async delete(id: string) {
        const team = await teamRepository.findById(id);
        if (!team) throw new Error("Turma não encontrada");

        return teamRepository.delete(id);
    },
};
