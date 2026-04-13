export interface Charge {
    id: string
    enrollmentId: string
    year: number
    month: number
    amount: number
    status: "PENDING" | "PAID" | "LATE"
}

export interface Payment {
    id: string
    chargeId: string
    amount: number
    method: "PIX" | "CASH" | "CREDIT_CARD" | "DEBIT_CARD"
  }
