import { createError, defineEventHandler, readBody, type H3Event } from "h3";
import { enrollmentService } from "#server/modules/enrollment/enrollment.service";

/**
 * POST /api/enrollments
 * Realiza a matrícula de um aluno em uma turma.
 */
export default defineEventHandler(async (event: H3Event) => {
    const body = await readBody<{ studentId: string; classId: string }>(event);

    if (!body.studentId || !body.classId) {
        throw createError({ statusCode: 400, statusMessage: "Parâmetros inválidos" });
    }

    try {
        return await enrollmentService.enroll({
            studentId: body.studentId,
            teamId: body.classId,
        });
    } catch (err: any) {
        throw createError({ statusCode: 400, statusMessage: err.message });
    }
});
