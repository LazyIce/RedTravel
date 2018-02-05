import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';

import { AppComponent } from './app.component';
import { NavComponent } from './nav.component';
import { SideComponent } from './side.component';
import { MapComponent } from './map.component';
import { RedspotService } from './redspot.service';

@NgModule({
    declarations: [
        AppComponent,
        NavComponent,
        SideComponent,
        MapComponent,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        InMemoryWebApiModule.forRoot(InMemoryDataService)
    ],
    providers: [ RedspotService ],
    bootstrap: [ AppComponent ]
})
export class AppModule {}
