import { teamService } from "#server/modules/team/team.service";

export default defineEventHandler(async (event) => {
    const { id } = event.context.params as { id: string };
    const body = await readBody<{
        title?: string;
        team_leader_id?: string;
        start_date?: Date;
        end_date?: Date;
        horary?: string;
        days_of_week?: string;
        active?: boolean;
        payment_date?: Date;
        price?: number;
    }>(event);

    try {
        return await teamService.update(id, body);
    } catch (err: any) {
        throw createError({ statusCode: 400, statusMessage: err.message });
    }
});
