import { Component, ViewChild } from '@angular/core';
import { MapComponent } from './map.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent {
    @ViewChild(MapComponent)
    private map: MapComponent;

    tabClicked(id: string) {
        if (id === 'all-tab') {
            this.map.addAllMarkers();
        } else if (id === 'not-tab') {
            this.map.addNotMarkers();
        } else if (id === 'history-tab') {
            this.map.addMyMarkers();
            this.map.addMyRoutes();
        }
    }
}
