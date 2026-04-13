import { enrollmentService } from "#server/modules/enrollment/enrollment.service";

export default defineEventHandler(async (event) => {
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
