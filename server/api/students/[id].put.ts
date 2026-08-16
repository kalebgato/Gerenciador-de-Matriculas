import { createError, defineEventHandler, readBody, type H3Event } from "h3";
import { studentService } from "#server/modules/student/student.service";

/**
 * PUT /api/students/:id
 * Atualiza os dados de um aluno existente.
 */
export default defineEventHandler(async (event: H3Event) => {
    const { id } = event.context.params as { id: string };
    const body = await readBody<{
        name?: string;
        cpf?: string;
        email?: string;
        dn?: Date;
        phone?: string;
        responsable_name?: string;
        responsable_phone?: string;
        active?: boolean;
    }>(event);

    try {
        return await studentService.update(id, body);
    } catch (err: any) {
        throw createError({ statusCode: 404, statusMessage: err.message });
    }
});
