/**
 * Interfaces para los datos de las gráficas del sistema
 */

// ============ INTERFACES PARA DATOS DE ENTRADA ============

/**
 * Representa un pago realizado en una fecha específica
 * Usado en la gráfica de Pagos por Sábado
 */
export interface PaymentData {
  date: string;      // Fecha en formato 'YYYY-MM-DD'
  amount: number;    // Monto pagado en COP
}

/**
 * Representa el pago acumulado hasta una fecha
 * Usado en la gráfica de Pagos Acumulados
 */
export interface AccumulatedPaymentData {
  date: string;          // Fecha en formato 'YYYY-MM-DD'
  totalAmount: number;   // Monto total acumulado en COP
}

/**
 * Representa la cantidad de estudiantes por institución
 * Usado en la gráfica de Estudiantes por Institución
 */
export interface StudentsByInstitutionData {
  institutionName: string;  // Nombre de la institución
  studentCount: number;     // Cantidad de estudiantes
}

/**
 * Representa el estado de pago de estudiantes
 * Usado en la gráfica de Estado de Pagos (Pie Chart)
 */
export interface PaymentStatusData {
  status: 'en proceso' | 'pagado' | 'no pagado';  // Estado del pago
  count: number;                                   // Cantidad de estudiantes
  label: string;                                   // Etiqueta descriptiva
}

/**
 * Representa datos genéricos para gráficas de distribución (Donut/Pie)
 * Usado en la gráfica de Instituciones
 */
export interface DistributionData {
  label: string;    // Etiqueta (nombre)
  value: number;    // Valor numérico
}
