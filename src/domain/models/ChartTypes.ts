export type ChartType = 'pie' | 'donut' | 'bar' | 'line' | 'area';

export interface ChartSeries {
  name?: string;
  data: number[];
  color?: string;
}

export interface BaseChartConfig {
  title?: string;
  subtitle?: string;
  height?: number;
  colors?: string[];
  showToolbar?: boolean;
  showDataLabels?: boolean;
  showLegend?: boolean;
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
}

export interface PieChartConfig extends BaseChartConfig {
  type: 'pie';
  series: number[];
  labels: string[];
  valueFormatter?: (val: number) => string;
  labelFormatter?: (val: number) => string;
}

export interface DonutChartConfig extends BaseChartConfig {
  type: 'donut';
  series: number[];
  labels: string[];
  donutSize?: string;
  valueFormatter?: (val: number) => string;
  labelFormatter?: (val: number) => string;
}

export interface BarChartConfig extends BaseChartConfig {
  type: 'bar';
  series: ChartSeries[];
  categories: string[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  horizontal?: boolean;
  columnWidth?: string;
  valueFormatter?: (val: number) => string;
}

export interface LineChartConfig extends BaseChartConfig {
  type: 'line';
  series: ChartSeries[];
  categories: string[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  curveType?: 'smooth' | 'straight' | 'stepline';
  strokeWidth?: number;
  markerSize?: number;
  valueFormatter?: (val: number) => string;
}

export interface AreaChartConfig extends BaseChartConfig {
  type: 'area';
  series: ChartSeries[];
  categories: string[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  curveType?: 'smooth' | 'straight' | 'stepline';
  fillOpacity?: number;
  valueFormatter?: (val: number) => string;
}

export type AnyChartConfig = PieChartConfig | DonutChartConfig | BarChartConfig | LineChartConfig | AreaChartConfig;
