import { Component } from '@angular/core';
import * as Leaflet from 'leaflet';
import iconPaths from './models/icons-enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'maps-frontend';
  
  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];
  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 16,
    center: { lat: 47.06365572118242, lng: 21.900861825903533 } , 
  }

  ngOnInit(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setGeoLocation.bind(this));
   }
  }

  setGeoLocation(position: { coords: { latitude: any; longitude: any } }) {
    const {
       coords: { latitude, longitude },
    } = position;
 
    // const  map = Leaflet.map('map').setView([latitude, longitude], 3);
 
    // Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>contributors'
    //  } ).addTo(map);

    const initialMarkers = [
      {
        position: { lat: latitude, lng: longitude },
        draggable: false
      },
    ];

    for (let index = 0; index < initialMarkers.length; index++) {
      const data = initialMarkers[index];
      const marker = this.generateMarker(data, index, "user");
      marker.addTo(this.map).bindPopup(`<b>You</b>`);
      this.map.panTo(data.position);
      this.markers.push(marker)
    }
 }

  initMarkers() {
    const initialMarkers = [
      {
        position: { lat: 47.066487431354, lng: 21.911233664018358 },
        draggable: true
      },
    ];
    for (let index = 0; index < initialMarkers.length; index++) {
      const data = initialMarkers[index];
      const marker = this.generateMarker(data, index, "party");
      marker.addTo(this.map).bindPopup(`<b>Beerpong Night</b><br><a href="https://www.example.com">Bilete</a>`);
      //this.map.panTo(data.position);
      this.markers.push(marker)
    }
  }

  generateMarker(data: any, index: number, type: string) {
    var greenIcon = Leaflet.icon({
      iconUrl: iconPaths[type],
  
      iconSize: [32, 32], // size of the icon
  });

    return Leaflet.marker(data.position, { draggable: data.draggable, icon: greenIcon})
      .on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }

  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.initMarkers();
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