import { courseService } from "#server/modules/course/course.service";

export default defineEventHandler(async (event) => {
    const body = await readBody<{ title: string; active?: boolean }>(event);
    try {
        return await courseService.create(body);
    } catch (err: any) {
        throw createError({ statusCode: 400, statusMessage: err.message });
    }
});
