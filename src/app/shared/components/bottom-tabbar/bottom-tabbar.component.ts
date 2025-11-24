import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom-tabbar',
  templateUrl: './bottom-tabbar.component.html',
  styleUrls: ['./bottom-tabbar.component.scss'],
  standalone: false,
})
export class BottomTabbarComponent {
  @Input() tabs: Array<{ icon: string; route?: string; aria?: string; color?: string }> = [];
  @Input() color = 'primary';
  @Output() tabClick = new EventEmitter<any>();

  constructor(private router: Router) {}

  public get colSize(): number {
    const len = this.tabs?.length || 4;
    return Math.floor(12 / (len || 4));
  }

  public onClick(tab: any) {
    this.tabClick.emit(tab);
    if (!tab) return;
    if (tab.route) {
      
      try {
        const route = tab.route;
        if (Array.isArray(route)) this.router.navigate(route);
        else this.router.navigate([route]);
      } catch (e) {
        console.error('[BottomTabbar] navigation failed', e);
      }
    }
  }
}
