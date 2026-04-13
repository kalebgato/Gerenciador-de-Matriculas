import { classService } from "#server/modules/course/course.service";

export default defineEventHandler(async (event) => {
    const { id } = event.context.params as { id: string };

    try {
        await classService.delete(id);
        return { message: "Turma deletada com sucesso" };
    } catch (err: any) {
        throw createError({ statusCode: 404, statusMessage: err.message });
    }
});
