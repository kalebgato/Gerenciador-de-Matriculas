import { studentService } from "#server/modules/student/student.service";

export default defineEventHandler(async () => {
    // GET /api/students
    return studentService.list();
});
