import { prisma } from "#server/lib/prisma"
import { ChargeStatus } from "#server/generated/enums";


export const billingRepository = {
    createCharge(data: {
        enrollment_id: string;
        amount: number;
        year: number;
        month: number;
        due_date: Date;
        status: ChargeStatus;
        paid?: boolean;
    }) {
        return prisma.charge.create({ data })
    },

    findCharge(id: string) {
        return prisma.charge.findUnique({
            where: { id },
            include: { payments: true }
        })
    },

    countChargesByEnrollmentAndYear(enrollment_id: string, year: number) {
        return prisma.charge.count({
            where: {
                enrollment_id,
                year,
            },
        })
    },

    createPayment(data: {
        enrollment_id: string;
        charge_id: string;
        amount: number;
        method: "PIX" | "BOLETO" | "CREDIT_CARD" | "DEBIT_CARD";
        payment_date?: Date;
    }) {
        return prisma.payment.create({ data })
    },

    updateChargeStatus(id: string, status: ChargeStatus) {
        return prisma.charge.update({
            where: { id },
            data: { status, paid: status === ChargeStatus.PAID }
        })
    },

    markOverdueCharges() {
        return prisma.charge.updateMany({
            where: {
                status: ChargeStatus.PENDING,
                due_date: { lt: new Date() },
                paid: false,
            },
            data: {
                status: ChargeStatus.OVERDUE,
            },
        })
    },

    listLateCharges() {
        return prisma.charge.findMany({
            where: {
                status: ChargeStatus.OVERDUE,
            },
            include: {
                enrollment: {
                    include: {
                        student: true,
                        team: true,
                    }
                }
            }
        })
    }
}
