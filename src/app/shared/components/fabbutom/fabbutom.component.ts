import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-fabbutom',
  templateUrl: './fabbutom.component.html',
  styleUrls: ['./fabbutom.component.scss'],
  standalone: false,
})
export class FabbutomComponent {
  public fabOpen = false;
  @Input() label: string = '';
  @Input() color: string = 'primary';
  @Input() position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' = 'bottom-right';
  @Input() actions: Array<{
    id: string;
    icon: string;
    label?: string;
    color?: string;
    kind?: 'fab' | 'normal';
  }> = [];
  @Output() actionClick = new EventEmitter<string>();

  public onActionClick(id: string) {
    this.actionClick.emit(id);
  }

}
