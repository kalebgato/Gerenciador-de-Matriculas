import { teamService } from "#server/modules/team/team.service";

export default defineEventHandler(async (event) => {
    const body = await readBody<{
        course_id: string;
        title: string;
        team_leader_id?: string;
        start_date?: Date;
        end_date?: Date;
        horary?: string;
        days_of_week?: string;
        active?: boolean;
        payment_date?: Date;
        price: number;
    }>(event);

    if (!body.course_id || !body.title || body.price === undefined) {
        throw createError({ statusCode: 400, statusMessage: "Parâmetros inválidos" });
    }

    try {
        return await teamService.create(body);
    } catch (err: any) {
        throw createError({ statusCode: 400, statusMessage: err.message });
    }
});
