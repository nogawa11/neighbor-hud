import { Controller } from "@hotwired/stimulus"
import mapboxgl from "mapbox-gl"
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder"
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

export default class extends Controller {
  static values = {
    apiKey: String,
    markers: Array
  }

  static targets = [ 'noSearch', "latitude", "longitude" ]

  async connect() {
    await this.#startMapbox()
    this.#centerMap()
    this.#addMarkersToMap()
    this.#addSearchBox()
    this.#addCurrentLocationButton()

    const latitude = document.querySelector(".latitude")
    const longitude = document.querySelector(".longitude")
    this.map.on('result', e => {
        latitude.value = e.result.center[0]
        longitude.value = e.result.center[1]
        console.log(e.result.center);
    });

    navigator.geolocation.getCurrentPosition((position) => {
      localStorage.setItem('lat', position.coords.latitude);
      localStorage.setItem('long', position.coords.longitude);
    });

    this.#isInNewIncidentPage() && this.#addMapInputToForm()
    this.#addDirections()
  }

/* --------------------------------- Private -------------------------------- */
  #getUserLocation() {
    navigator.geolocation.getCurrentPosition(position => {
      this.map.setCenter([position.coords.longitude, position.coords.latitude])
    });
  }

  #getIncidentLocation() {
    const lng = this.markersValue[0].lng;
    const lat = this.markersValue[0].lat;
    console.log(lng, lat);
    this.map.setCenter([lng, lat])
    this.map.setZoom(13)
  }

  #centerMap() {
    this.#isInShowPage() ? this.#getIncidentLocation() : this.#getUserLocation()
  }

  #startMapbox() {
    // Initialize MapBox.
    mapboxgl.accessToken = this.apiKeyValue
    this.map = new mapboxgl.Map({
      container: this.element,
      style: "mapbox://styles/ayanorii/cl05huof2003o15nuivl7b2y7",
    })
  }

  #addSearchBox() {
    // Adds the search box if the current page is not /incidents/:id.
    if (!this.#isInShowPage()) {
      this.map.addControl(new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
      }))
    }
  }

  #addMarkersToMap() {
    this.markersValue.forEach((marker) => {
      const background = marker.src ? marker.src.toLowerCase() : "https://i.imgur.com/7teZKVh.png"

      const popup = new mapboxgl.Popup(
        {
          closeOnClick: false,
          closeButton: false
        }).setHTML(
          `<a href="incidents/${marker.id}?path=map"
          class="mapbox-icon"
          style="background-image: url(${background})"></a>`
        )
      const emptyMarker = document.createElement('div');

      new mapboxgl.Marker(emptyMarker)
      .setLngLat([marker.lng, marker.lat])
      .addTo(this.map)
      .setPopup(popup)
      .togglePopup();
    });
  }

  #addCurrentLocationButton() {
    // Adds a current location button.
    this.map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    }));
  }

  #addMapInputToForm() {
    // When adding a new report, gets the the input from MapBox search box and inserts into the simple form.
    const input = document.querySelector(".mapboxgl-ctrl-geocoder--input")
    input.addEventListener("keyup", (e) => {
      document.getElementById("incident_location").value = e.currentTarget.value
    })
    input.addEventListener("change", (e) => {
      document.getElementById("incident_location").value = e.currentTarget.value
    })
  }

  #isInShowPage() {
    return (/\/incidents\/\d+.*/).test(window.location.pathname);
  }

  #isInNewIncidentPage() {
    return (/\/incidents\/new\/?/).test(window.location.pathname)
  }

  #addDirections() {
    window.location.pathname.includes("/route")
      && this.map.addControl(
      new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        profile: 'mapbox/walking',
        alternatives: true,
        geometries: 'geojson',
        controls: { instructions: false },
      }),
      "top-left"
      );
  }

  #fitMapToMarkers() {
    const bounds = new mapboxgl.LngLatBounds()
    this.markersValue.forEach(marker => bounds.extend([ marker.lng, marker.lat ]))
    this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 })
  }
}
