import { studentService } from "#server/modules/student/student.service";

export default defineEventHandler(async (event) => {
    const { id } = event.context.params as { id: string };

    try {
        await studentService.delete(id);
        return { message: "Aluno deletado com sucesso" };
    } catch (err: any) {
        throw createError({ statusCode: 404, statusMessage: err.message });
    }
});
