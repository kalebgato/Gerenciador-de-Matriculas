import { createError, defineEventHandler, type H3Event } from "h3";
import { courseService } from "#server/modules/course/course.service";

/**
 * GET /api/courses/:id
 * Busca uma turma pelo identificador.
 */
export default defineEventHandler(async (event: H3Event) => {
    const { id } = event.context.params as { id: string };

    try {
        return await courseService.findById(id);
    } catch (err: any) {
        throw createError({ statusCode: 404, statusMessage: err.message });
    }
});
