import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';


type CheckboxLabelPosition = 'start' | 'end' | 'fixed' | 'stacked';
type CheckboxJustify = 'start' | 'end' | 'space-between';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  standalone : false
})
export class CheckboxComponent  implements OnInit {
  @Input() label: string = '';
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() indeterminate: boolean = false;
  @Input() labelPosition: CheckboxLabelPosition = 'end';
  @Input() justify: CheckboxJustify = 'space-between';
  @Input() control: AbstractControl | null = null;
  @Input() value: any;
  @Input() name: string = '';
  @Input() cssClass: string = '';

  constructor() { }

  ngOnInit() {
    if (this.control) {
      this.checked = !!this.control.value;
    }
  }

  public onChange(event: any): void {
    const checked = event?.detail?.checked ?? !!event?.target?.checked;
    this.checked = !!checked;

    if (this.control) {
      this.control.setValue(this.checked);
      console.log('Checkbox control value set to:', this.control.value);
      this.control.markAsDirty();
      this.control.markAsTouched();
    }
  }
}
