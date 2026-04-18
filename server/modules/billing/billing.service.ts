import { billingRepository } from "./billing.repository";
import { ChargeStatus, PaymentMethod } from "#server/generated/enums";

export const billingService = {
    async generateMonthlyCharges(data: { enrollmentId: string; amount: number; year: number }) {
        const { enrollmentId, amount, year } = data;

        if (amount <= 0) throw new Error("Valor da cobrança deve ser maior que zero");

        const existingCharges = await billingRepository.countChargesByEnrollmentAndYear(enrollmentId, year);
        if (existingCharges > 0) {
            throw new Error("Cobranças desse ano já foram geradas para esta matrícula");
        }

        for (let month = 1; month <= 12; month++) {
            const chargeData = {
                enrollment_id: enrollmentId,
                amount: amount,
                year: year,
                month: month,
                due_date: new Date(year, month - 1, 10),
                status: ChargeStatus.PENDING,
                paid: false,
            };

            await billingRepository.createCharge(chargeData);
        }
    },

    async payCharge(data: { chargeId: string; amount: number; method: PaymentMethod }) {
        const { chargeId, amount, method } = data;
        const charge = await billingRepository.findCharge(chargeId);

        if (!charge) throw new Error("Cobrança não encontrada");
        if (amount <= 0) throw new Error("Valor do pagamento deve ser maior que zero");
        if (charge.status === ChargeStatus.PAID || charge.paid) {
            throw new Error("Cobrança já está quitada");
        }

        const dataPayment = {
            charge_id: chargeId,
            enrollment_id: charge.enrollment_id,
            amount: amount,
            method: method,
            payment_date: new Date(),
        };
        await billingRepository.createPayment(dataPayment);

        const payments = [...charge.payments, { amount }];
        const totalPaid = payments.reduce((acc, p) => acc + Number(p.amount), 0);

        if (totalPaid >= Number(charge.amount)) {
            await billingRepository.updateChargeStatus(chargeId, ChargeStatus.PAID);
        }
    },

    async getLatePayments() {
        await billingRepository.markOverdueCharges();
        return billingRepository.listLateCharges();
    },
};
