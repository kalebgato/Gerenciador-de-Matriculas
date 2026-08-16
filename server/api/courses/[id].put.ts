import { createError, defineEventHandler, readBody, type H3Event } from "h3";
import { courseService } from "#server/modules/course/course.service";

/**
 * PUT /api/courses/:id
 * Atualiza uma turma existente.
 */
export default defineEventHandler(async (event: H3Event) => {
    const { id } = event.context.params as { id: string };
    const body = await readBody<{ title?: string; active?: boolean }>(event);

    try {
        return await courseService.update(id, body);
    } catch (err: any) {
        throw createError({ statusCode: 404, statusMessage: err.message });
    }
});
