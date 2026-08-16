import { defineEventHandler, type H3Event } from "h3";
import { studentService } from "#server/modules/student/student.service";

/**
 * GET /api/students
 * Lista todos os alunos cadastrados.
 */
export default defineEventHandler(async (_event: H3Event) => {
    return studentService.list();
});
