
export interface Invoices {
    invoice_id: string,
    creation_date: string,
    status: boolean,
    total_value: number,
    discount: number,
    paid_amount: number,
    installments: number,
    remaining_debt: number,
    student_id: string,
    ie_id: string
}