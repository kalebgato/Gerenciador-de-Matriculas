import { studentService } from "#server/modules/student/student.service";

export default defineEventHandler(async (event) => {
    const body = await readBody<{
        name: string;
        cpf: string;
        email?: string;
        dn?: Date;
        phone?: string;
        responsable_name?: string;
        responsable_phone?: string;
        active?: boolean;
    }>(event);
    try {
        const student = await studentService.create(body);
        return student;
    } catch (err: any) {
        throw createError({ statusCode: 400, statusMessage: err.message });
    }
});
