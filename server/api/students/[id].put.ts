import { studentService } from "#server/modules/student/student.service";
import type {
    StudentUpdateInput,
    StudentUncheckedUpdateInput,
} from "#server/generated/models";

export default defineEventHandler(async (event) => {
    const { id } = event.context.params as { id: string };
    const body = await readBody<StudentUpdateInput | StudentUncheckedUpdateInput>(event);

    try {
        return await studentService.update(id, body);
    } catch (err: any) {
        throw createError({ statusCode: 404, statusMessage: err.message });
    }
});
