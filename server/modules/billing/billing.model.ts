export interface Charge {
    id: string
    enrollment_id: string
    year: number
    month: number
    amount: number
    due_date: Date
    paid: boolean
    status: "PENDING" | "PAID" | "OVERDUE"
}

export interface Payment {
    id: string
    charge_id: string
    enrollment_id: string
    amount: number
    payment_date: Date
    method: "PIX" | "BOLETO" | "CREDIT_CARD" | "DEBIT_CARD"
  }
