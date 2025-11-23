import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: false,
})
export class CardComponent  implements OnInit {
  @Input() imgSrc: string = '';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() text: string = '';
  
  //para las card del home
  @Input() value: string | number = '';
  @Input() label: string = '';
  @Input() variant: 'default' | 'kpi' = 'default';
  constructor() { }

  ngOnInit() {}

}
