import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent as ApexChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexPlotOptions,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexStroke,
  ApexMarkers
} from 'ng-apexcharts';

export type ChartOptions = {
  series?: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis;
  title?: ApexTitleSubtitle;
  dataLabels?: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  legend?: ApexLegend;
  labels?: string[];
  colors?: string[];
  responsive?: ApexResponsive[];
  stroke?: ApexStroke;
  markers?: ApexMarkers;
};

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  standalone: false,
})
export class ChartComponent implements OnInit {
  @ViewChild('chart') chart!: ApexChartComponent;
  
  @Input() chartOptions!: ChartOptions;

  constructor() {}

  ngOnInit() {}
}
