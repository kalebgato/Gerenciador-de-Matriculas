import { classService } from "#server/modules/course/course.service";

export default defineEventHandler(async (event) => {
    return classService.list();
});
