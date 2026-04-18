export interface Team {
    id: string
    course_id: string
    title: string
    team_leader_id?: string
    start_date?: Date
    end_date?: Date
    horary?: string
    days_of_week?: string
    active: boolean
    payment_date?: Date
    price: number
}
