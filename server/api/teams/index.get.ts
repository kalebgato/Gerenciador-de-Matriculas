import { teamService } from "#server/modules/team/team.service";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const courseId = typeof query.course_id === "string" ? query.course_id : undefined;

    if (courseId) {
        return teamService.listByCourse(courseId);
    }

    return teamService.listAll();
});
