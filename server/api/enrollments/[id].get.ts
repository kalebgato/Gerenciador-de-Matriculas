import { createError, defineEventHandler, type H3Event } from "h3";
import { enrollmentService } from "#server/modules/enrollment/enrollment.service";

/**
 * GET /api/enrollments/:id
 * Busca uma matrícula pelo identificador.
 */
export default defineEventHandler(async (event: H3Event) => {
    const { id } = event.context.params as { id: string };

    try {
        return await enrollmentService.getById(id);
    } catch (err: any) {
        throw createError({ statusCode: 404, statusMessage: err.message });
    }
});
