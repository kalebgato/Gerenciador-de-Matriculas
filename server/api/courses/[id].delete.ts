import { courseService } from "#server/modules/course/course.service";

export default defineEventHandler(async (event) => {
    const { id } = event.context.params as { id: string };

    try {
        await courseService.delete(id);
        return { message: "Curso deletado com sucesso" };
    } catch (err: any) {
        throw createError({ statusCode: 404, statusMessage: err.message });
    }
});
