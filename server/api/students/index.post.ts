import { studentService } from "#server/modules/student/student.service";
import type { StudentCreateInput } from "#server/generated/models";

export default defineEventHandler(async (event) => {
    const body = await readBody<StudentCreateInput>(event);
    try {
        const student = await studentService.create(body);
        return student;
    } catch (err: any) {
        throw createError({ statusCode: 400, statusMessage: err.message });
    }
});
