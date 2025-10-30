// checkbox.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

type CheckboxLabelPosition = 'start' | 'end' | 'fixed' | 'stacked';
type CheckboxJustify = 'start' | 'end' | 'space-between';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  standalone: false,
})
export class CheckboxComponent implements OnInit {
  @Input() label: string = '';
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() indeterminate: boolean = false;
  @Input() labelPosition: CheckboxLabelPosition = 'end';
  @Input() justify: CheckboxJustify = 'space-between';
  @Input() value: any;
  @Input() name: string = '';
  @Input() cssClass: string = '';

  @Output() checkedChange = new EventEmitter<boolean>();
  @Output() valueChange = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {}

  onCheckboxChange(event: any) {
    this.checked = event.detail.checked;
    this.checkedChange.emit(this.checked);
    this.valueChange.emit(this.value);
  }

  // Toggle the checkbox when the wrapper is clicked
  public toggle() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
    this.valueChange.emit(this.value);
  }
}