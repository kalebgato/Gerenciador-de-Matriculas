import { prisma } from "#server/lib/prisma"
import { ChargeCreateInput, PaymentCreateInput} from "#server/generated/models";
import { ChargeStatus } from "#server/generated/enums";


export const billingRepository = {
    createCharge(data: ChargeCreateInput) {
        return prisma.charge.create({ data })
    },

    findCharge(id: string) {
        return prisma.charge.findUnique({
            where: { id },
            include: { payments: true }
        })
    },

    createPayment(data: PaymentCreateInput) {
        return prisma.payment.create({ data })
    },

    updateChargeStatus(id: string, status: ChargeStatus) {
        return prisma.charge.update({
            where: { id },
            data: { status }
        })
    },

    listLateCharges() {
        return prisma.charge.findMany({
            where: {
                status: "PENDING",
                dueDate: { lt: new Date() }
            },
            include: {
                enrollment: {
                    include: {
                        student: true
                    }
                }
            }
        })
    }
}
