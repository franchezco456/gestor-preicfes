import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

type InputType = 'text' |'password'| 'email' | 'number' | 'date';
@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  standalone: false,
})
export class InputComponent  implements OnInit {
  @Input() label : string = '';
  @Input() placeholder : string = '';
  @Input() type : InputType = 'text';
  @Input() control : AbstractControl | null = new FormControl();
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {}

  public onChange(event: any) {
    if (this.control) {
      this.control.setValue(event.target.value);
      this.valueChange.emit(this.control.value);
    }
  }

}
