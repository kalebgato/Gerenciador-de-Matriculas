import { enrollmentService } from "#server/modules/enrollment/enrollment.service";

export default defineEventHandler(async (event) => {
    const body = await readBody<{ student_id: string; team_id: string }>(event);

    if (!body.student_id || !body.team_id) {
        throw createError({ statusCode: 400, statusMessage: "Parâmetros inválidos" });
    }

    try {
        return await enrollmentService.enroll(body);
    } catch (err: any) {
        throw createError({ statusCode: 400, statusMessage: err.message });
    }
});
