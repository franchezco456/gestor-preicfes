export interface PaymentData { date: string; amount: number }
export interface AccumulatedPaymentData { date: string; totalAmount: number }
export interface StudentsByInstitutionData { institutionName: string; studentCount: number }
export interface PaymentStatusData { status: 'en proceso' | 'pagado' | 'no pagado'| any; count: number; label: string }
export interface DistributionData { label: string; value: number }
