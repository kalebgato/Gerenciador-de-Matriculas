import { createError, defineEventHandler, readBody, type H3Event } from "h3";
import { courseService } from "#server/modules/course/course.service";

interface CourseCreateBody {
    title: string;
    active?: boolean;
}

/**
 * POST /api/courses
 * Cria um novo curso.
 */
export default defineEventHandler(async (event: H3Event) => {
    const body = await readBody<CourseCreateBody>(event);

    if (!body.title || typeof body.title !== "string") {
        throw createError({ statusCode: 400, statusMessage: "Parâmetros inválidos" });
    }

    try {
        return await courseService.create(body);
    } catch (err: any) {
        throw createError({ statusCode: 400, statusMessage: err.message });
    }
});
