import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MenuController, IonMenu } from '@ionic/angular';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false, 
})
export class SidebarComponent implements OnInit {
  /** Inputs similar to ion-menu */
  @Input() side: 'start' | 'end' = 'start';
  @Input() menuId?: string;
  @Input() contentId?: string;
  @Input() disabled: boolean = false;
  @Input() swipeGesture: boolean = true;

  /** Outputs that mirror ion-menu events */
  @Output() ionOpen = new EventEmitter<any>();
  @Output() ionClose = new EventEmitter<any>();
  @Output() ionWillOpen = new EventEmitter<any>();
  @Output() ionWillClose = new EventEmitter<any>();
  @Output() ionDrag = new EventEmitter<any>();

  @ViewChild(IonMenu, { static: false }) menu?: IonMenu;

  constructor(private readonly menuCtrl: MenuController) {}

  ngOnInit() {}

  // Programmatic API similar to IonMenu
  public async open(): Promise<boolean> {
    try {
      return await this.menuCtrl.open(this.menuId);
    } catch (e) {
      console.warn('Sidebar: open() failed', e);
      return false;
    }
  }

  public async close(): Promise<boolean> {
    try {
      return await this.menuCtrl.close(this.menuId);
    } catch (e) {
      console.warn('Sidebar: close() failed', e);
      return false;
    }
  }

  public async toggle(): Promise<boolean> {
    try {
      return await this.menuCtrl.toggle(this.menuId);
    } catch (e) {
      console.warn('Sidebar: toggle() failed', e);
      return false;
    }
  }

  public async isOpen(): Promise<boolean> {
    try {
      return await this.menuCtrl.isOpen(this.menuId);
    } catch (e) {
      console.warn('Sidebar: isOpen() failed', e);
      return false;
    }
  }

  // Event handlers forwarded from template
  public handleWillOpen(ev: any) {
    this.ionWillOpen.emit(ev);
  }

  public handleOpen(ev: any) {
    this.ionOpen.emit(ev);
  }

  public handleWillClose(ev: any) {
    this.ionWillClose.emit(ev);
  }

  public handleClose(ev: any) {
    this.ionClose.emit(ev);
  }

  public handleDrag(ev: any) {
    this.ionDrag.emit(ev);
  }

}
