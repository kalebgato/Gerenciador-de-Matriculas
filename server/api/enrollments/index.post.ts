import { createError, defineEventHandler, readBody, type H3Event } from "h3";
import { enrollmentService } from "#server/modules/enrollment/enrollment.service";

<<<<<<< HEAD
export default defineEventHandler(async (event) => {
    const body = await readBody<{ student_id: string; team_id: string }>(event);
=======
/**
 * POST /api/enrollments
 * Realiza a matrícula de um aluno em uma turma.
 */
export default defineEventHandler(async (event: H3Event) => {
    const body = await readBody<{ studentId: string; classId: string }>(event);
>>>>>>> refs/remotes/origin/develop

    if (!body.student_id || !body.team_id) {
        throw createError({ statusCode: 400, statusMessage: "Parâmetros inválidos" });
    }

    try {
        return await enrollmentService.enroll(body);
    } catch (err: any) {
        throw createError({ statusCode: 400, statusMessage: err.message });
    }
});
