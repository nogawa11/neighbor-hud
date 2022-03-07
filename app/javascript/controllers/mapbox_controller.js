import { Controller } from "@hotwired/stimulus"
import mapboxgl from "mapbox-gl"
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder"
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import * as turf from "@turf/turf"
import polyline from "@mapbox/polyline"

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
    this.bbox = [0, 0, 0, 0];
    this.polygon = turf.bboxPolygon(this.bbox);
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

    this.directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      profile: "mapbox/walking",
      alternatives: true,
      geometries: "geojson",
      controls: { instructions: false },
    });

    this.#isInNewIncidentPage() && this.#addMapInputToForm()
    this.#addDirections()
    this.#displayObstacles()
    this.#clearRoutesAndBoxes();
    this.#checkRoutesForCollisions()
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
        this.directions,
        "top-left"
      );
  }

  #getGsonFeatures() {
    const features = []
    this.markersValue.forEach(marker => {
      features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [marker.lng, marker.lat]
        }
      })
    })
    return features
  }

  #getGsonIncidents() {
    const incidents = {
      type: "FeatureCollection",
      features: this.#getGsonFeatures()
    }
    return incidents
  }

  #getObstacle() {
    const obstacle = turf.buffer(this.#getGsonIncidents(), 0.9, { units: "kilometers" });

    return obstacle
  }

  #displayObstacles() {
    this.map.on("load", () => {
      this.map.addLayer({
        id: "obstacles",
        type: "fill",
        source: {
          type: "geojson",
          data: this.#getObstacle(),
        },
        layout: {},
        paint: {
          "fill-color": "#f03b20",
          "fill-opacity": 0.5,
          "fill-outline-color": "#f03b20",
        },
      });

      // Source and layer for the route
      this.map.addSource("theRoute", {
        type: "geojson",
        data: {
          type: "Feature",
        },
      });

      this.map.addLayer({
        id: "theRoute",
        type: "line",
        source: "theRoute",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#cccccc",
          "line-opacity": 0.9,
          "line-width": 13,
          "line-blur": 0.5,
        },
      });
    });
  }

  #clearRoutesAndBoxes() {
    this.directions.on('clear', () => {
      this.map.setLayoutProperty('theRoute', 'visibility', 'none');
    });
  }

  #checkRoutesForCollisions() {
    this.directions.on("route", (event) => {
      // Hide the route and box by setting the opacity to zero
      this.map.setLayoutProperty("theRoute", "visibility", "none");

      for (const route of event.route) {
        this.map.setLayoutProperty("theRoute", "visibility", "visible");
        // Get GeoJSON LineString feature of route
        const routeLine = polyline.toGeoJSON(route.geometry);
        this.bbox = turf.bbox(routeLine);
        this.polygon = turf.bboxPolygon(this.bbox);
        this.map.getSource("theRoute").setData(routeLine);
        const clear = turf.booleanDisjoint(this.#getObstacle(), routeLine);

        if (clear) {
          this.map.setPaintProperty("theRoute", "line-color", "#74c476");
        } else {
          this.bbox = turf.bbox(this.polygon);
          this.map.setPaintProperty("theRoute", "line-color", "#de2d26");
        }
      }

      // Update the data for the route
      // This will update the route line on the map
    });
  }
}
