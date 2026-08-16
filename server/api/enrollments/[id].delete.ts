import { createError, defineEventHandler, type H3Event } from "h3";
import { enrollmentService } from "#server/modules/enrollment/enrollment.service";

/**
 * DELETE /api/enrollments/:id
 * Remove a matrícula somente quando a turma continua ativa.
 */
export default defineEventHandler(async (event: H3Event) => {
    const { id } = event.context.params as { id: string };

    try {
        await enrollmentService.delete(id);
        return { message: "Matrícula removida com sucesso" };
    } catch (err: any) {
        throw createError({ statusCode: 400, statusMessage: err.message });
    }
});
