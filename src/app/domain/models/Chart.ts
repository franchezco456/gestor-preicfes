/**
 * Interfaces para la configuración de gráficas
 */

import { 
  PaymentData, 
  AccumulatedPaymentData, 
  StudentsByInstitutionData, 
  PaymentStatusData,
  DistributionData 
} from './ChartData';

// ============ CONFIGURACIÓN BASE ============

/**
 * Configuración base compartida por todas las gráficas
 */
export interface BaseChartOptions {
  title?: string;
  subtitle?: string;
  height?: number;
  colors?: string[];
  showToolbar?: boolean;
  showDataLabels?: boolean;
  showLegend?: boolean;
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
}

/**
 * Configuración adicional para gráficas con ejes (Bar, Line)
 */
export interface AxisChartOptions extends BaseChartOptions {
  xAxisTitle?: string;
  yAxisTitle?: string;
  valueFormatter?: (val: number) => string;
}

// ============ INTERFACES ESPECÍFICAS POR TIPO DE GRÁFICA ============

/**
 * Configuración completa para la gráfica de Estado de Pagos (Pie)
 */
export interface PaymentStatusChart {
  type: 'pie';
  data: PaymentStatusData[];
  options: BaseChartOptions;
}

/**
 * Configuración completa para la gráfica de Pagos por Sábado (Bar)
 */
export interface PaymentsBySaturdayChart {
  type: 'bar';
  data: PaymentData[];
  options: AxisChartOptions;
}

/**
 * Configuración completa para la gráfica de Pagos Acumulados (Line)
 */
export interface AccumulatedPaymentsChart {
  type: 'line';
  data: AccumulatedPaymentData[];
  options: AxisChartOptions;
}

/**
 * Configuración completa para la gráfica de Distribución (Donut)
 */
export interface DistributionChart {
  type: 'donut';
  data: DistributionData[];
  options: BaseChartOptions;
}

/**
 * Configuración completa para la gráfica de Estudiantes por Institución (Bar)
 */
export interface StudentsByInstitutionChart {
  type: 'bar';
  data: StudentsByInstitutionData[];
  options: AxisChartOptions;
}

// ============ TIPOS UNION ============

/**
 * Tipo union de todas las configuraciones de gráficas disponibles
 */
export type ChartConfiguration = 
  | PaymentStatusChart
  | PaymentsBySaturdayChart
  | AccumulatedPaymentsChart
  | DistributionChart
  | StudentsByInstitutionChart;

/**
 * Tipos de gráficas soportados
 */
export type ChartType = 'pie' | 'bar' | 'line' | 'donut';
