import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

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
  constructor() {
  }

  ngOnInit() {

  }

  onButtonClick(i : data){
    console.log('Button clicked for item:', i);
  }

}
