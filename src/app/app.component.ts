import { Component } from '@angular/core';
import * as Leaflet from 'leaflet';
import iconPaths from './models/icons-enum';
import { Marker } from './models/Marker';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('0.5s', style({ opacity: 0 })),
      ]),
    ]),
  ]
})
export class AppComponent {
  isLoading: boolean = false;
  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];
  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 15,
    //center: { lat: 47.06365572118242, lng: 21.900861825903533 } , 
  }

  ngOnInit() {

  }

  private findUserPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setUserPositionMark.bind(this));
    }
  }

  setUserPositionMark(position: { coords: { latitude: any; longitude: any } }) {
    const {
      coords: { latitude, longitude },
    } = position;

    const userPositionMarker: Marker =
    {
      position: { lat: latitude, lng: longitude },
      draggable: false,
      description: "Me"
    };

    const data = userPositionMarker;
    const userMarker = this.generateMarker(data, 0, "user");
    userMarker.addTo(this.map).bindPopup(data.description);
    this.map.panTo(data.position);
    this.markers.push(userMarker);
    console.log("Set geo location done.");
    this.showEventsOnMap();
  }

  showEventsOnMap() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
    let eventsMarkers: Marker[] = this.findNearbyEvents();
    for (let index = 0; index < eventsMarkers.length; index++) {
      const data: Marker = eventsMarkers[index];
      const marker = this.generateMarker(data, index, "party");
      marker.addTo(this.map).bindPopup(data.description);
      //this.map.panTo(data.position);
      this.markers.push(marker)
    }
    console.log("Show eventslocation done.");
  }

  private findNearbyEvents(): Marker[]{
    const eventsMarkers: Marker[] = [
      {
        position: { lat: 47.066487431354, lng: 21.911233664018358 },
        draggable: true,
        description: `<b>Beerpong Night</b><br>Azi (9pm - 2am)<br><a href="https://www.example.com">Bilete</a>`
      },
      {
        position: { lat: 47.061605891457404, lng: 21.905843922142584 },
        draggable: true,
        description: `<b>Girl's Night</b><br>Azi (9pm - 2am)<br><a href="https://www.example.com">Bilete</a>`
      },
    ];
    return eventsMarkers;
  }

  generateMarker(data: any, index: number, type: string) {
    var greenIcon = Leaflet.icon({
      iconUrl: iconPaths[type],
      iconSize: [32, 32],
    });

    return Leaflet.marker(data.position, { draggable: data.draggable, icon: greenIcon})
      .on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }

  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.findUserPosition();
  }

  mapClicked($event: any) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerClicked($event: any, index: number) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerDragEnd($event: any, index: number) {
    console.log($event.target.getLatLng());
  } 
}
