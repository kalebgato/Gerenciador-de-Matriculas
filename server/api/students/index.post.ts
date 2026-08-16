import { createError, defineEventHandler, readBody, type H3Event } from "h3";
import { studentService } from "#server/modules/student/student.service";

interface StudentCreateBody {
    name: string;
    cpf: string;
    email?: string;
    dn?: Date | string;
    phone?: string;
    responsable_name?: string;
    responsable_phone?: string;
    active?: boolean;
}

/**
 * POST /api/students
 * Cria um novo aluno.
 */
export default defineEventHandler(async (event: H3Event) => {
    const body = await readBody<Partial<StudentCreateBody>>(event);
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const cpf = typeof body.cpf === "string" ? body.cpf.trim() : "";

    if (!name || !cpf) {
        throw createError({ statusCode: 400, statusMessage: "Parâmetros inválidos" });
    }

    const normalizedBody = {
        ...body,
        name,
        cpf,
        dn: body.dn ? new Date(body.dn) : undefined,
    };

    try {
        const student = await studentService.create({
            name: normalizedBody.name,
            cpf: normalizedBody.cpf,
            email: normalizedBody.email,
            dn: normalizedBody.dn,
            phone: normalizedBody.phone,
            responsable_name: normalizedBody.responsable_name,
            responsable_phone: normalizedBody.responsable_phone,
            active: normalizedBody.active,
        });
        return student;
    } catch (err: any) {
        throw createError({ statusCode: 400, statusMessage: err.message });
    }
});
