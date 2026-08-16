import { createError, defineEventHandler, type H3Event } from "h3";
import { studentService } from "#server/modules/student/student.service";

/**
 * DELETE /api/students/:id
 * Remove um aluno do sistema.
 */
export default defineEventHandler(async (event: H3Event) => {
    const { id } = event.context.params as { id: string };

    try {
        await studentService.delete(id);
        return { message: "Aluno deletado com sucesso" };
    } catch (err: any) {
        throw createError({ statusCode: 404, statusMessage: err.message });
    }
});
