import { createError, defineEventHandler, readBody, type H3Event } from "h3";
import { courseService } from "#server/modules/course/course.service";
import type { CourseCreateInput } from "#server/generated/models";

/**
 * POST /api/courses
 * Cria uma nova turma.
 */
export default defineEventHandler(async (event: H3Event) => {
    const body = await readBody<CourseCreateInput>(event);

    try {
        return await courseService.create(body);
    } catch (err: any) {
        throw createError({ statusCode: 400, statusMessage: err.message });
    }
});
