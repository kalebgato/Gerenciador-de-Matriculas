import { courseRepository } from "./course.repository";
import type { CourseCreateInput, CourseUpdateInput } from "#server/generated/models";

 export const courseService = {
    async create(data: CourseCreateInput) {
        // Validações de negócio podem ser adicionadas aqui
        return courseRepository.create(data);
    },

    async list() {
        return courseRepository.list();
    },

    async findById(id: string) {
        const course = await courseRepository.findById(id);
        if (!course) throw new Error("Curso não encontrado");
        return course;
    },

    async update(id: string, data: CourseUpdateInput) {
        const course = await courseRepository.findById(id);
        if (!course) throw new Error("Curso não encontrado");

        return courseRepository.update(id, data);
    },

    async delete(id: string) {
        const course = await courseRepository.findById(id);
        if (!course) throw new Error("Curso não encontrado");

        return courseRepository.delete(id);
    },
};
