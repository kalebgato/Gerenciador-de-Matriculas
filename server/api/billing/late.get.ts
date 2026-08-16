import { createError, defineEventHandler, type H3Event } from "h3";
import { billingService } from "#server/modules/billing/billing.service";

/**
 * GET /api/billing/late
 * Retorna as cobranças em atraso.
 */
export default defineEventHandler(async (_event: H3Event) => {
    try {
        return await billingService.getLatePayments();
    } catch (err: any) {
        throw createError({ statusCode: 500, statusMessage: err.message });
    }
});
