import { teamService } from "#server/modules/team/team.service";

export default defineEventHandler(async (event) => {
    const { id } = event.context.params as { id: string };

    try {
        return await teamService.getById(id);
    } catch (err: any) {
        throw createError({ statusCode: 404, statusMessage: err.message });
    }
});
