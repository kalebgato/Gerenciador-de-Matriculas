import { createError, defineEventHandler, type H3Event } from "h3";
import { enrollmentService } from "#server/modules/enrollment/enrollment.service";

/**
 * GET /api/enrollments/student/:id
 * Lista as matrículas vinculadas a um aluno específico.
 */
export default defineEventHandler(async (event: H3Event) => {
    const { id: studentId } = event.context.params as { id: string };

    if (!studentId) {
        throw createError({ statusCode: 400, statusMessage: "ID do aluno obrigatório" });
    }

    try {
        return await enrollmentService.listByStudent(studentId);
    } catch (err: any) {
        throw createError({ statusCode: 404, statusMessage: err.message });
    }
});
