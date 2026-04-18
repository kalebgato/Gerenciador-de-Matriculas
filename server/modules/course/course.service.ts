import { courseRepository } from "./course.repository";

 export const courseService = {
    async create(data: { title: string; active?: boolean }) {
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

    async update(id: string, data: { title?: string; active?: boolean }) {
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
