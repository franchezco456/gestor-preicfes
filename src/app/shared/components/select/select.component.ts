import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  standalone: false,
})
export class SelectComponent {
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() options: { value: any; text: string }[] = [];
  @Input() control: AbstractControl | null = null;
  @Input() cssClass = '';
  @Input() lines: 'full' | 'inset' | 'none' = 'none';
  @Input() interface: 'alert' | 'action-sheet' | 'popover' = 'popover';

  public onChange(event: CustomEvent<{ value: any }>): void {
    if (!this.control) {
      return;
    }

    const value = event.detail?.value;
    this.control.setValue(value);
    console.log('Select value changed to:', value);
    this.control.markAsDirty();
    this.control.markAsTouched();
  }
}
