import { billingService } from "#server/modules/billing/billing.service";
import { ChargeStatus, PaymentMethod } from "#server/generated/enums";

export default defineEventHandler(async (event) => {
    const body = await readBody<{
        action: "generate" | "pay";
        enrollmentId?: string;
        year?: number;
        amount: number;
        chargeId?: string;
        method?: string;
    }>(event);

    try {
        if (body.action === "generate") {
            if (!body.enrollmentId || !body.year) {
                throw new Error("Parâmetros inválidos para gerar cobrança");
            }
            await billingService.generateMonthlyCharges({
                enrollmentId: body.enrollmentId,
                amount: body.amount,
                year: body.year,
            });
            return { message: "Cobranças mensais geradas com sucesso" };
        }

        if (body.action === "pay") {
            if (!body.chargeId || !body.method) {
                throw new Error("Parâmetros inválidos para pagamento");
            }

            // Converte string para enum PaymentMethod
            const methodEnum = PaymentMethod[body.method.toUpperCase() as keyof typeof PaymentMethod];
            if (!methodEnum) throw new Error("Método de pagamento inválido");

            await billingService.payCharge({
                chargeId: body.chargeId,
                amount: body.amount,
                method: methodEnum,
            });
            return { message: "Pagamento realizado com sucesso" };
        }

        throw new Error("Ação inválida");
    } catch (err: any) {
        throw createError({ statusCode: 400, statusMessage: err.message });
    }
});
