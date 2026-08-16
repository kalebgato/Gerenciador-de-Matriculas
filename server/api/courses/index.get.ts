import { defineEventHandler, type H3Event } from "h3";
import { courseService } from "#server/modules/course/course.service";

/**
 * GET /api/courses
 * Lista todas as turmas cadastradas.
 */
export default defineEventHandler(async (_event: H3Event) => {
    return courseService.list();
});
