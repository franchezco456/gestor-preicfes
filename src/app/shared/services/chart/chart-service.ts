import { Injectable } from '@angular/core';
import { 
  PaymentData, 
  AccumulatedPaymentData, 
  StudentsByInstitutionData 
} from 'src/app/domain/models';

export interface ChartConfig {
  title?: string;
  subtitle?: string;
  height?: number;
  colors?: string[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  showToolbar?: boolean;
  showDataLabels?: boolean;
  showLegend?: boolean;
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  valueFormatter?: (val: number) => string;
  labelFormatter?: (val: number) => string;
}

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  private defaultConfig: ChartConfig = {
    height: 350,
    showToolbar: true,
    showDataLabels: true,
    showLegend: true,
    legendPosition: 'bottom',
    colors: ['blue', 'green', 'orange', 'red', 'purple', 'pink']
  };

  createPieChart(
    data: number[],
    labels: string[],
    config: ChartConfig = {}
  ): any {
    const finalConfig = { ...this.defaultConfig, ...config };

    return {
      series: data,
      chart: {
        type: 'pie',
        height: finalConfig.height,
        toolbar: { show: finalConfig.showToolbar }
      },
      labels: labels,
      colors: finalConfig.colors,
      title: finalConfig.title ? {
        text: finalConfig.title,
        align: 'center',
        style: { fontSize: '18px', fontWeight: 'bold' }
      } : undefined,
      legend: {
        show: finalConfig.showLegend,
        position: finalConfig.legendPosition
      },
      dataLabels: {
        enabled: finalConfig.showDataLabels,
        formatter: finalConfig.labelFormatter || function(val: number) {
          return val.toFixed(1) + '%';
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: { width: 300 },
          legend: { position: 'bottom' }
        }
      }]
    };
  }

  createBarChart(
    data: { x: string; y: number }[] | PaymentData[] | StudentsByInstitutionData[],
    config: ChartConfig = {}
  ): any {
    const finalConfig = { ...this.defaultConfig, ...config };
    
    // Convertir datos a formato { x, y } si es necesario
    const formattedData = data.map((item: any) => {
      if ('date' in item && 'amount' in item) {
        // Es PaymentData
        return { x: item.date, y: item.amount };
      } else if ('institutionName' in item && 'studentCount' in item) {
        // Es StudentsByInstitutionData
        return { x: item.institutionName, y: item.studentCount };
      } else {
        // Ya está en formato { x, y }
        return item;
      }
    });

    return {
      series: [{
        name: config.subtitle || 'Valor',
        data: formattedData
      }],
      chart: {
        type: 'bar',
        height: finalConfig.height,
        toolbar: { show: finalConfig.showToolbar }
      },
      colors: finalConfig.colors,
      plotOptions: {
        bar: {
          borderRadius: 8,
          horizontal: false,
          columnWidth: '60%'
        }
      },
      dataLabels: {
        enabled: finalConfig.showDataLabels,
        formatter: finalConfig.valueFormatter || function(val: number) {
          return val.toLocaleString('es-CO');
        },
        style: { fontSize: '12px', colors: ['grey'] }
      },
      xaxis: {
        type: 'category',
        title: finalConfig.xAxisTitle ? {
          text: finalConfig.xAxisTitle,
          style: { fontSize: '14px' }
        } : undefined
      },
      yaxis: {
        title: finalConfig.yAxisTitle ? {
          text: finalConfig.yAxisTitle,
          style: { fontSize: '14px' }
        } : undefined,
        labels: {
          formatter: finalConfig.valueFormatter || function(val: number) {
            return val.toLocaleString('es-CO');
          }
        }
      },
      title: finalConfig.title ? {
        text: finalConfig.title,
        align: 'left',
        style: { fontSize: '18px', fontWeight: 'bold' }
      } : undefined,
      legend: {
        show: finalConfig.showLegend,
        position: finalConfig.legendPosition
      }
    };
  }

  createLineChart(
    data: { x: string; y: number }[] | AccumulatedPaymentData[],
    config: ChartConfig = {}
  ): any {
    const finalConfig = { ...this.defaultConfig, ...config };
    
    // Convertir datos a formato { x, y } si es necesario
    const formattedData = data.map((item: any) => {
      if ('date' in item && 'totalAmount' in item) {
        // Es AccumulatedPaymentData
        return { x: item.date, y: item.totalAmount };
      } else {
        // Ya está en formato { x, y }
        return item;
      }
    });

    return {
      series: [{
        name: config.subtitle || 'Valor',
        data: formattedData
      }],
      chart: {
        type: 'line',
        height: finalConfig.height,
        toolbar: { show: finalConfig.showToolbar },
        zoom: { enabled: true }
      },
      colors: finalConfig.colors,
      stroke: {
        curve: 'smooth',
        width: 3
      },
      dataLabels: {
        enabled: finalConfig.showDataLabels
      },
      markers: {
        size: 6,
        colors: finalConfig.colors,
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: { size: 8 }
      },
      xaxis: {
        type: 'category',
        title: finalConfig.xAxisTitle ? {
          text: finalConfig.xAxisTitle,
          style: { fontSize: '14px' }
        } : undefined
      },
      yaxis: {
        title: finalConfig.yAxisTitle ? {
          text: finalConfig.yAxisTitle,
          style: { fontSize: '14px' }
        } : undefined,
        labels: {
          formatter: finalConfig.valueFormatter || function(val: number) {
            return val.toLocaleString('es-CO');
          }
        }
      },
      title: finalConfig.title ? {
        text: finalConfig.title,
        align: 'left',
        style: { fontSize: '18px', fontWeight: 'bold' }
      } : undefined,
      legend: {
        show: finalConfig.showLegend,
        position: finalConfig.legendPosition
      }
    };
  }

  createDonutChart(
    data: number[],
    labels: string[],
    config: ChartConfig = {}
  ): any {
    const pieConfig = this.createPieChart(data, labels, config);
    pieConfig.chart.type = 'donut';
    return pieConfig;
  }
}

