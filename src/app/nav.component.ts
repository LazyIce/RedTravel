import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-navbar',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.less']
})

export class NavComponent {
    isActive: number;
    @Output() tabClicked = new EventEmitter<string>();

    constructor() {
        this.isActive = 0;
    }

    onActive(id: string) {
        if (id === 'all-tab') {
            this.isActive = 0;
        } else if (id === 'not-tab') {
            this.isActive = 1;
        } else {
            this.isActive = 2;
        }
        this.tabClicked.emit(id);
    }
}
