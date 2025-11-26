import { Component, Input, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';

type data = {
  title: string;
  detail: string;
  button?: string | null;
  studentId?: string;
}
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: false
})
export class ListComponent implements OnInit {
  @Input() items: any[] = [];
  @Input() titleField: string = 'title' ;
  @Input() titleField2?: string;
  @Input() subtitleField: string = 'detail';
  @Input() emptyText: string = 'No hay elementos';
  @Input() cardTitle: string = '';
  @Input() showCardTitle: boolean = true;
    @Input() showButton: boolean = true;
    @Output() view = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  onButtonClick(i: any) {
    this.view.emit(i);
  }
}
