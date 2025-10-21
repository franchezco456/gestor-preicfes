import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  standalone: false,
})
export class SelectComponent {
  @Input() placeholder: string = 'Select an option';
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() options: { value: any; text: string }[] = [];
  @Input() value: any;

  @Output() valueChange = new EventEmitter<any>();

  onValueChange(event: any) {
    this.valueChange.emit(event.detail.value);
  }
}
