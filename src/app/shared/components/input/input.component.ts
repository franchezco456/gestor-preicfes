import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

type InputType = 'text' | 'password' | 'email' | 'number' | 'date' | 'tel';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  standalone: false,
})
export class InputComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: InputType = 'text';
  @Input() control: AbstractControl | null = null;
  @Input() cssClass = '';
  @Input() lines: 'full' | 'inset' | 'none' = 'none';
  @Input() inputmode?: string;
  @Input() autocomplete?: string;
  @Input() labelPosition: 'floating' | 'fixed' | 'stacked' = 'floating';

  public onInput(event: CustomEvent<{ value?: string | null }>): void {
    if (!this.control) {
      return;
    }

  const value = event.detail?.value ?? '';
    this.control.setValue(value);
    this.control.markAsDirty();
  }

  public onBlur(): void {
    this.control?.markAsTouched();
  }
}
