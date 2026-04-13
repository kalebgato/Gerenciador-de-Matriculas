import { billingRepository } from "./billing.repository";
import type { ChargeCreateInput, PaymentCreateInput } from "#server/generated/models";
import { ChargeStatus, PaymentMethod } from "#server/generated/enums";

export const billingService = {
    async generateMonthlyCharges(data: { enrollmentId: string; amount: number; year: number }) {
        const { enrollmentId, amount, year } = data;

        for (let month = 1; month <= 12; month++) {
            const chargeData: ChargeCreateInput = {
                enrollment: { connect: { id: enrollmentId } },
                amount: amount,
                year: year,
                month: month,
                dueDate: new Date(year, month - 1, 10),
                status: ChargeStatus.PENDING,
            };

            await billingRepository.createCharge(chargeData);
        }
    },

    async payCharge(data: { chargeId: string; amount: number; method: PaymentMethod }) {
        const { chargeId, amount, method } = data;
        const charge = await billingRepository.findCharge(chargeId);

        if (!charge) throw new Error("Cobrança não encontrada");

        // Cria o pagamento
        const dataPayment: PaymentCreateInput = {
            charge: { connect: { id: chargeId } },
            amount: amount,
            method: method
        };
        await billingRepository.createPayment(dataPayment);

        // Recalcula total pago incluindo o pagamento recém-criado
        const payments = [...charge.payments, { amount }];
        const totalPaid = payments.reduce((acc, p) => acc + Number(p.amount), 0);

        if (totalPaid >= Number(charge.amount)) {
            await billingRepository.updateChargeStatus(chargeId, ChargeStatus.PAID);
        }
    },

    async getLatePayments() {
        return billingRepository.listLateCharges();
    },
};
