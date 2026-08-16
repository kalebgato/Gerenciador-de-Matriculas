import { createError, defineEventHandler, type H3Event } from "h3";
import { courseService } from "#server/modules/course/course.service";

/**
 * DELETE /api/courses/:id
 * Remove uma turma do sistema.
 */
export default defineEventHandler(async (event: H3Event) => {
    const { id } = event.context.params as { id: string };

    try {
        await courseService.delete(id);
        return { message: "Turma deletada com sucesso" };
    } catch (err: any) {
        throw createError({ statusCode: 404, statusMessage: err.message });
    }
});
