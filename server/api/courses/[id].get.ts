import { courseService } from "#server/modules/course/course.service";

export default defineEventHandler(async (event) => {
    const { id } = event.context.params as { id: string };
    try {
        return await courseService.findById(id);
    } catch (err: any) {
        throw createError({ statusCode: 404, statusMessage: err.message });
    }
   
});
