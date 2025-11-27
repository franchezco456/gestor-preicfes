import { Component, OnInit } from '@angular/core';
import { Preferences } from './core/services/preferences/preferences';
import { Data } from './core/services/data/data';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(
    private readonly preferencesSrv: Preferences,
    private readonly dataSrv: Data
  ) { }

  async ngOnInit() {
    await this.checkSessionAndLoadData();
  }

  private async checkSessionAndLoadData() {
    try {
      // 1. Intentamos recuperar la sesión guardada
      const coord = await this.preferencesSrv.getPreferences('coordData');

      if (coord) {
        const data = coord.coordData || coord;
        const id_IE = data?.id_IE_Cicle;
        if (id_IE) {
          console.log('🔄 [App] Sesión detectada. Cargando datos globales para IE:', id_IE);
          this.dataSrv.loadStudents(id_IE);
          this.dataSrv.loadInstitutions(id_IE);
          this.dataSrv.setCoordinator(data);
        }
      }
      this.dataSrv.loadStudents();
      this.dataSrv.loadInstitutions();

    } catch (error) {
      console.warn('⚠️ [App] No se pudo cargar la sesión inicial', error);
    }
  }
}
