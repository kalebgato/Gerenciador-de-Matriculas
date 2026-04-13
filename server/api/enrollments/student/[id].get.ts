import { enrollmentService } from "#server/modules/enrollment/enrollment.service";

export default defineEventHandler(async (event) => {
    const { id: studentId } = event.context.params as { id: string };

    if (!studentId) {
        throw createError({ statusCode: 400, statusMessage: "ID do aluno obrigatório" });
    }

    try {
        return await enrollmentService.listByStudent(studentId);
    } catch (err: any) {
        throw createError({ statusCode: 404, statusMessage: err.message });
    }
});
