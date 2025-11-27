import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

type data = {
  title: string;
  detail: string;
  button?: string | null;
}
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: false
})
export class ListComponent implements OnInit {
  @Input() items: data[] = [];
  @Output() itemClick = new EventEmitter<data>();
  constructor() {}

  ngOnInit() {

  }

  onButtonClick(i: data) {
    this.itemClick.emit(i);
  }

}
