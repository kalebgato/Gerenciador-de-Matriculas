import { studentService } from "#server/modules/student/student.service";

export default defineEventHandler(async (event) => {
    const { id } = event.context.params as { id: string };
    // GET /api/students/:id
    try {
        const student = await studentService.findById(id);
        return student;
    } catch (err: any) {
        throw createError({ statusCode: 404, statusMessage: err.message });
      }
});
