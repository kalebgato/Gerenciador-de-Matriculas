import { courseService } from "#server/modules/course/course.service";

export default defineEventHandler(async (event) => {
    return courseService.list();
});
