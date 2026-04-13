import { courseService } from "#server/modules/course/course.service";
import type { CourseUpdateInput } from "#server/generated/models";

export default defineEventHandler(async (event) => {
    const { id } = event.context.params as { id: string };
    const body = await readBody<CourseUpdateInput>(event);

    try {
        return await courseService.update(id, body);
    } catch (err: any) {
        throw createError({ statusCode: 404, statusMessage: err.message });
    }
});
