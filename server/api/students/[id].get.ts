import { createError, defineEventHandler, type H3Event } from "h3";
import { studentService } from "#server/modules/student/student.service";

/**
 * GET /api/students/:id
 * Busca um aluno pelo identificador.
 */
export default defineEventHandler(async (event: H3Event) => {
    const { id } = event.context.params as { id: string };

    try {
        const student = await studentService.findById(id);
        return student;
    } catch (err: any) {
        throw createError({ statusCode: 404, statusMessage: err.message });
    }
});
