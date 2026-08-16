import { createError, defineEventHandler, readBody, type H3Event } from "h3";
import { studentService } from "#server/modules/student/student.service";

/**
 * POST /api/students
 * Cria um novo aluno.
 */
export default defineEventHandler(async (event: H3Event) => {
    const body = await readBody<StudentCreateInput>(event);

    try {
        const student = await studentService.create(body);
        return student;
    } catch (err: any) {
        throw createError({ statusCode: 400, statusMessage: err.message });
    }
});
