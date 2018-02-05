import { Component, AfterViewInit} from '@angular/core';
import { Redspot } from './redspot';
import { RedspotService } from './redspot.service';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.less'],
    providers: [RedspotService]
})
export class MapComponent implements AfterViewInit {
    redspots: Redspot[];
    myRedspots: Redspot[];
    mymap: any;

    constructor(private redspotService: RedspotService) {
    }

    ngAfterViewInit() {
        let self = this;
        /* create the map */
        this.mymap = new AMap.Map('map', {
            resizeEnable: true,
            zoom: 12,
            center: [121.45, 31.26],
            features: ['bg', 'road', 'building', 'point']
        });
        /* add zoom control */
        AMapUI.loadUI(['control/BasicControl'], function(BasicControl) {
            let zoomCtrl = new BasicControl.Zoom({
                theme: 'dark'
            });
            self.mymap.addControl(zoomCtrl);
        });
        /* get data and add marker&infoWindow */
        this.redspotService.getRedspots()
            .then(redspots => {
                this.redspots = redspots.filter(function(d) {
                    return d.status === 0;
                });
                this.myRedspots = redspots.filter(function(d) {
                    return d.status === 1;
                });
                this.addAllMarkers();
            });
    }

    addAllMarkers() {
        this.mymap.clearMap();
        this.addNotMarkers();
        this.addMyMarkers();
    }

    addNotMarkers() {
        let self = this;
        this.mymap.clearMap();
        AMapUI.loadUI(['overlay/AwesomeMarker', 'overlay/SimpleInfoWindow'], function(AwesomeMarker, SimpleInfoWindow) {
            for (let i = 0; i < self.redspots.length; i++) {
                let marker = new AwesomeMarker({
                    map: self.mymap,
                    position: [self.redspots[i].geo.lng, self.redspots[i].geo.lat],
                    awesomeIcon: 'star',
                    iconLabel: {
                        style: {
                            color: 'yellow'
                        }
                    },
                    iconStyle: 'red',
                    animation: 'AMAP_ANIMATION_DROP',
                    extData: self.redspots[i].name
                });
                /* add click infoWindow */
                let infoWindow = new SimpleInfoWindow({
                    infoTitle: '<h style="color:steelblue; margin:0 10px;">' + self.redspots[i].name + '</h>',
                    infoBody: '<p style="font-size:0.9rem; margin:5px 10px;">' + self.redspots[i].intro + '</p>' + '<img src=\"' + self.redspots[i].img + '\" \>',
                    offset: new AMap.Pixel(0, -30),
                    autoMove: true,
                    closeWhenClickMap: true
                });
                marker.on('click', function() {
                    infoWindow.open(self.mymap, marker.getPosition());
                });
                /* add hover infoWindow */
                let titleWindow = new AMap.InfoWindow({
                    content: '<h style="color:steelblue;">' + self.redspots[i].name + '</h>',
                    offset: new AMap.Pixel(0, -30)
                });
                marker.on('mouseover', function() {
                    titleWindow.open(self.mymap, marker.getPosition());
                });
                marker.on('mouseout', function() {
                    titleWindow.close();
                });
            }
        });
    }

    addMyMarkers() {
        let self = this;
        this.mymap.clearMap();
        AMapUI.loadUI(['overlay/SvgMarker', 'overlay/SimpleInfoWindow'], function(SvgMarker, SimpleInfoWindow) {
            let shape = new SvgMarker.Shape.RectangleFlagPin({
                height: 50,
                fillColor: 'red',
                strokeWidth: '1',
                strokeColor: 'red'
            });
            for (let i = 0; i < self.myRedspots.length; i++) {
                let myMarker = new SvgMarker(shape, {
                    map: self.mymap,
                    position: [self.myRedspots[i].geo.lng, self.myRedspots[i].geo.lat],
                    iconLabel: {
                        innerHTML: '<div>F</div>',
                        style: {
                            color: 'yellow'
                        }
                    },
                    iconStyle: 'red',
                    showPositionPoint: true,
                    animation: 'AMAP_ANIMATION_DROP',
                    extData: self.myRedspots[i].name
                });
                /* add click infoWindow */
                let infoWindow = new SimpleInfoWindow({
                    infoTitle: '<h style="color:steelblue; margin:0 10px;">' + self.redspots[i].name + '</h>',
                    infoBody: '<p style="font-size:0.9rem; margin:5px 10px;">' + self.redspots[i].intro + '</p>' + '<img src=\"' + self.redspots[i].img + '\" \>',
                    offset: new AMap.Pixel(15, -40),
                    autoMove: true,
                    closeWhenClickMap: true
                });
                myMarker.on('click', function() {
                    infoWindow.open(self.mymap, myMarker.getPosition());
                });
                /* add hover infoWindow */
                let titleWindow = new AMap.InfoWindow({
                    content: '<h style="color:steelblue;">' + self.redspots[i].name + '</h>',
                    offset: new AMap.Pixel(15, -40)
                });
                myMarker.on('mouseover', function() {
                    titleWindow.open(self.mymap, myMarker.getPosition());
                });
                myMarker.on('mouseout', function() {
                    titleWindow.close();
                });
            }
        });
    }
}
