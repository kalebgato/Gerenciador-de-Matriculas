import { createError, defineEventHandler, readBody, type H3Event } from "h3";
import { enrollmentService } from "#server/modules/enrollment/enrollment.service";

interface EnrollmentUpdateBody {
    team_id?: string;
}

/**
 * PUT /api/enrollments/:id
 * Atualiza a turma da matrícula quando a turma alvo ainda está ativa.
 */
export default defineEventHandler(async (event: H3Event) => {
    const { id } = event.context.params as { id: string };
    const body = await readBody<Partial<EnrollmentUpdateBody>>(event);

    if (!body.team_id) {
        throw createError({ statusCode: 400, statusMessage: "Parâmetros inválidos" });
    }

    try {
        return await enrollmentService.update(id, { team_id: body.team_id });
    } catch (err: any) {
        throw createError({ statusCode: 400, statusMessage: err.message });
    }
});
