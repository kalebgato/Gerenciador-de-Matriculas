import { courseService } from "#server/modules/course/course.service";
import type { CourseCreateInput } from "#server/generated/models";

export default defineEventHandler(async (event) => {
    const body = await readBody<CourseCreateInput>(event);
    try {
        return await courseService.create(body);
    } catch (err: any) {
        throw createError({ statusCode: 400, statusMessage: err.message });
    }
});
