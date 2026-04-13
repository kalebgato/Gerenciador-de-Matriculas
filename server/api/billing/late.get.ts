import { billingService } from "#server/modules/billing/billing.service";
// /api/billing/late
export default defineEventHandler(async () => {
    try {
        return await billingService.getLatePayments();
    } catch (err: any) {
        throw createError({ statusCode: 500, statusMessage: err.message });
    }
});
