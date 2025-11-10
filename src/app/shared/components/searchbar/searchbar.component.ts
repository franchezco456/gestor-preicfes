// searchbar.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

type SearchbarType = 'search' | 'text' | 'email' | 'number' | 'password' | 'tel' | 'url';
type SearchbarInputMode = 'decimal' | 'email' | 'none' | 'numeric' | 'search' | 'tel' | 'text' | 'url';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
  standalone: false,
})
export class SearchbarComponent implements OnInit {
  @Input() placeholder: string = 'Buscar...';
  @Input() value: string = '';
  @Input() disabled: boolean = false;
  @Input() searchIcon: string = 'search';
  @Input() clearIcon: string = 'close-circle';
  @Input() type: SearchbarType = 'search';
  @Input() inputmode: SearchbarInputMode = 'search';
  @Input() animated: boolean = false;
  @Input() showClearButton: 'always' | 'focus' | 'never' = 'always';
  @Input() debounce: number = 0;
  @Input() cssClass: string = '';

  @Output() valueChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<any>();
  @Output() clear = new EventEmitter<void>();
  @Output() input = new EventEmitter<any>();
  @Output() blur = new EventEmitter<any>();
  @Output() focus = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {}

  onInputChange(event: any) {
    this.value = event.detail.value;
    this.valueChange.emit(this.value);
  }

  onSearch(event: any) {
    this.search.emit(event);
  }

  onClear(event: any) {
    this.clear.emit(event);
  }

  onInput(event: any) {
    this.input.emit(event);
  }

  onBlur(event: any) {
    this.blur.emit(event);
  }

  onFocus(event: any) {
    this.focus.emit(event);
  }
}