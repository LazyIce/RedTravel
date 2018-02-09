import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Redspot } from './redspot';
import { RedspotService } from './redspot.service';
import { SideComponent } from './side.component';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.less'],
    providers: [RedspotService]
})
export class MapComponent implements AfterViewInit {
    notRedspots: Redspot[];
    myRedspots: Redspot[];
    mymap: any;
    @ViewChild(SideComponent)
    private side: SideComponent;

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
                this.notRedspots = redspots.filter((redspot) => {
                    return redspot.status === 0;
                });
                this.myRedspots = redspots.filter((redspot) => {
                    return redspot.status === 1;
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
            for (let i = 0; i < self.notRedspots.length; i++) {
                let marker = new AwesomeMarker({
                    map: self.mymap,
                    position: [self.notRedspots[i].geo.lng, self.notRedspots[i].geo.lat],
                    awesomeIcon: 'star',
                    iconLabel: {
                        style: {
                            color: 'yellow'
                        }
                    },
                    iconStyle: 'red',
                    animation: 'AMAP_ANIMATION_DROP',
                    extData: self.notRedspots[i].name
                });
                /* add click infoWindow */
                let infoWindow = new SimpleInfoWindow({
                    infoTitle: '<h style="color:steelblue; margin:0 10px;">' + self.notRedspots[i].name + '</h>',
                    infoBody: '<p style="font-size:0.9rem; margin:5px 10px;">' + self.notRedspots[i].intro + '</p>' + '<img src=\"' + self.notRedspots[i].img + '\" \>',
                    offset: new AMap.Pixel(0, -30),
                    autoMove: true,
                    closeWhenClickMap: true
                });
                marker.on('click', function() {
                    infoWindow.open(self.mymap, marker.getPosition());
                });
                /* add hover infoWindow */
                let titleWindow = new AMap.InfoWindow({
                    content: '<h style="color:steelblue;">' + self.notRedspots[i].name + '</h>',
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
            let flagShape = new SvgMarker.Shape.RectangleFlagPin({
                height: 50,
                fillColor: 'red',
                strokeWidth: '1',
                strokeColor: 'red'
            });
            for (let i = 0; i < self.myRedspots.length; i++) {
                let myMarker = new SvgMarker(flagShape, {
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
                    infoTitle: '<h style="color:steelblue; margin:0 10px;">' + self.myRedspots[i].name + '</h>',
                    infoBody: '<p style="font-size:0.9rem; margin:5px 10px;">' + self.myRedspots[i].intro + '</p>' + '<img src=\"' + self.myRedspots[i].img + '\" \>',
                    offset: new AMap.Pixel(15, -40),
                    autoMove: true,
                    closeWhenClickMap: true
                });
                myMarker.on('click', function() {
                    infoWindow.open(self.mymap, myMarker.getPosition());
                });
                /* add hover infoWindow */
                let titleWindow = new AMap.InfoWindow({
                    content: '<h style="color:steelblue;">' + self.myRedspots[i].name + '</h>',
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

    addMyRoutes() {
        let self = this;
        AMapUI.loadUI(['overlay/AwesomeMarker'], function(AwesomeMarker) {
            let origin = [121.404691, 31.227892];
            /* add origin */
            let marker = new AwesomeMarker({
                map: self.mymap,
                position: origin,
                awesomeIcon: 'building',
                iconLabel: {
                    style: {
                        color: 'yellow'
                    }
                },
                iconStyle: 'blue',
                animation: 'AMAP_ANIMATION_DROP'
            });
            let titleWindow = new AMap.InfoWindow({
                content: '<h style="color:steelblue;">华东师范大学</h>',
                offset: new AMap.Pixel(0, -30)
            });
            marker.on('mouseover', function() {
                titleWindow.open(self.mymap, marker.getPosition());
            });
            marker.on('mouseout', function() {
                titleWindow.close();
            });
            /* add routes */
            AMap.service('AMap.Driving', () => {
                let colors = [
                    "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
                    "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
                    "#651067", "#329262", "#5574a6", "#3b3eac"
                ];
                for (let i = 0; i < self.myRedspots.length; i++) {
                    let transfer = new AMap.Driving({
                        map: self.mymap
                    });
                    transfer.search(origin, [self.myRedspots[i].geo.lng, self.myRedspots[i].geo.lat]);
                }
            });
        });
    }

    itemSelected(redspot: Redspot) {
        let self = this;
        AMapUI.loadUI(['overlay/SimpleInfoWindow'], function(SimpleInfoWindow) {
            let infoWindow = new SimpleInfoWindow({
                infoTitle: '<h style="color:steelblue; margin:0 10px;">' + redspot.name + '</h>',
                infoBody: '<p style="font-size:0.9rem; margin:5px 10px;">' + redspot.intro + '</p>' + '<img src=\"' + redspot.img + '\" \>',
                offset: new AMap.Pixel(15, -40),
                autoMove: true,
                closeWhenClickMap: true
            });
            infoWindow.open(self.mymap, [redspot.geo.lng, redspot.geo.lat]);
        });
    }

    mapClicked() {
        this.side.selectedRedspot = null;
    }
}
