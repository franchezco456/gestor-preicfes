export interface Payment {
    payment_id: string,
    payment_value: number,
    payment_date: string,
    invoice_id: string,
    student_id: string,
    ie_dane: string,
    course_value: number,
    remaining_debt: number
}