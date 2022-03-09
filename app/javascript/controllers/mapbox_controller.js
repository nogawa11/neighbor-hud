import { Controller } from "@hotwired/stimulus";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import * as turf from "@turf/turf";
import polyline from "@mapbox/polyline";

export default class extends Controller {
  static values = {
    apiKey: String,
    markers: Array,
  };

  static targets = ["noSearch", "latitude", "longitude"];

  connect() {
    this.#startMapbox();
    this.#centerMap();
    this.#addMarkersToMap();
    this.#addSearchBox();
    this.#addCurrentLocationButton();

    this.counter = 0;
    this.maxAttempts = 50;

    this.bbox = [0, 0, 0, 0];
    this.polygon = turf.bboxPolygon(this.bbox);

    const latitude = document.querySelector(".latitude");
    const longitude = document.querySelector(".longitude");
    this.map.on("result", (e) => {
      latitude.value = e.result.center[0];
      longitude.value = e.result.center[1];
    });

    navigator.geolocation.getCurrentPosition((position) => {
      localStorage.setItem("lat", position.coords.latitude);
      localStorage.setItem("long", position.coords.longitude);
    });

    this.directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      profile: "mapbox/walking",
      alternatives: true,
      geometries: "geojson",
      controls: { instructions: false },
    });

    this.#isInNewIncidentPage() && this.#addMapInputToForm();
    this.#addDirections();
    this.#startRouteMap();
    this.#clearRoutesAndBoxes();
    this.#checkRoutesForCollisions();
    this.#isInRoutePage() && this.#preventHiddenSuggestions();
  }

  /* --------------------------------- Private -------------------------------- */
  #getUserLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.map.setCenter([position.coords.longitude, position.coords.latitude]);
    });
  }

  #getIncidentLocation() {
    // This method is for the show page
    // Get the longitude and the latitude of markersValue[0] below
    const lng = this.markersValue[0].lng;
    const lat = this.markersValue[0].lat;
    this.map.setCenter([lng, lat]);
    this.map.setZoom(13);
  }

  #centerMap() {
    this.#isInShowPage()
      ? this.#getIncidentLocation()
      : this.#getUserLocation();
  }

  #startMapbox() {
    // Initialize MapBox.
    mapboxgl.accessToken = this.apiKeyValue;
    this.map = new mapboxgl.Map({
      container: this.element,
      style: "mapbox://styles/ayanorii/cl05huof2003o15nuivl7b2y7",
    });
  }

  #addSearchBox() {
    // Adds the search box if the current page is not /incidents/:id.
    if (!this.#isInShowPage()) {
      this.map.addControl(
        new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl,
        })
      );
      this.#changeInputPlaceholder();
    }
  }

  #addPopup(marker, background) {
    return new mapboxgl.Popup({
      closeOnClick: false,
      closeButton: false,
    }).setHTML(
      `<a href="/incidents/${marker.id}?path=map"
          class="mapbox-icon"
          style="background-image: url(${background})"></a>`
    );
  }

  #addMarkersToMap() {
    this.markersValue.forEach((marker) => {
      const background = marker.src
        ? marker.src.toLowerCase()
        : "https://i.imgur.com/7teZKVh.png";

      const popup = this.#addPopup(marker, background);
      console.log(marker);
      if (marker.user !== null) {
        this.#changeMarkerColor(popup);
      }

      const emptyMarker = document.createElement("div");
      new mapboxgl.Marker(emptyMarker)
        .setLngLat([marker.lng, marker.lat])
        .addTo(this.map)
        .setPopup(popup)
        .togglePopup();
    });
  }

  #changeMarkerColor(popup) {
    const parent = popup._content;
    parent.style.backgroundColor = "#2360eb";
    setTimeout(() => {
      parent.previousElementSibling.classList.add("news-icon");
    }, 100);
  }

  #addCurrentLocationButton() {
    // Adds a current location button.
    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      })
    );
  }

  #addMapInputToForm() {
    // When adding a new report, gets the the input from MapBox search box and inserts into the simple form.
    const input = document.querySelector(".mapboxgl-ctrl-geocoder--input");
    input.addEventListener("keyup", (e) => {
      document.getElementById("incident_location").value =
        e.currentTarget.value;
    });
    input.addEventListener("change", (e) => {
      document.getElementById("incident_location").value =
        e.currentTarget.value;
    });
  }

  #isInShowPage() {
    return /\/incidents\/\d+.*/.test(window.location.pathname);
  }

  #isInNewIncidentPage() {
    return /\/incidents\/new\/?/.test(window.location.pathname);
  }

  #isInRoutePage() {
    return window.location.pathname.includes("/route");
  }

  #addDirections() {
    window.location.pathname.includes("/route") &&
      this.map.addControl(this.directions, "top-left");
  }

  #getGsonFeatures() {
    const features = [];
    this.markersValue.forEach((marker) => {
      features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [marker.lng, marker.lat],
        },
      });
    });
    return features;
  }

  #getGsonIncidents() {
    const incidents = {
      type: "FeatureCollection",
      features: this.#getGsonFeatures(),
    };
    return incidents;
  }

  #getObstacle() {
    const obstacle = turf.buffer(this.#getGsonIncidents(), 0.25, {
      units: "kilometers",
    });

    return obstacle;
  }

  #addRouteLineLayerAndSource() {
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
        "line-opacity": 0.85,
        "line-width": 13,
        "line-blur": 0.8,
      },
    });
  }

  #addObstacles() {
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
  }

  #setOriginPosition() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.directions.setOrigin([
        position.coords.longitude,
        position.coords.latitude,
      ]);
    });
  }

  #startRouteMap() {
    this.map.on("load", () => {
      this.#addObstacles();
      this.#addRouteLineLayerAndSource();
      this.#setOriginPosition();
    });
  }

  #setLayersVisibility(visibility) {
    this.map.setLayoutProperty("theRoute", "visibility", visibility);
  }

  #clearRoutesAndBoxes() {
    // Hide the route and box by setting the opacity to zero
    this.directions.on("clear", () => {
      this.#setLayersVisibility("none");
    });
  }

  #setRouteLineColor(clear) {
    if (clear) {
      this.map.setPaintProperty("theRoute", "line-color", "#74c476");
    } else {
      this.bbox = turf.bbox(this.polygon);
      this.map.setPaintProperty("theRoute", "line-color", "#de2d26");
    }
  }

  #findNewRoute() {
    // Add a randomly selected waypoint to get a new route from the Directions API
    const randomWaypoint = turf.randomPoint(10, { bbox: this.bbox });
    this.directions.setWaypoint(
      0,
      randomWaypoint["features"][0].geometry.coordinates
    );
    this.counter += 1;
  }

  #checkRoutesForCollisions() {
    this.directions.on("route", (event) => {
      this.#setLayersVisibility("none");

      if (this.counter <= this.maxAttempts) {
        for (const route of event.route) {
          this.#setLayersVisibility("visible");

          // Get GeoJSON LineString feature of route
          const routeLine = polyline.toGeoJSON(route.geometry);
          this.bbox = turf.bbox(routeLine);
          this.polygon = turf.bboxPolygon(this.bbox);
          this.map.getSource("theRoute").setData(routeLine);

          const clear = turf.booleanDisjoint(this.#getObstacle(), routeLine);
          if (clear) {
            this.#setRouteLineColor(clear);
            this.counter = 0;
          } else {
            this.#setRouteLineColor(clear);
            this.#findNewRoute();
          }
        }
      } else {
        this.#noRouteFoundMessage();
        this.counter = 0;
      }
    });
  }

  #preventHiddenSuggestions() {
    const swapButton = document.querySelector(".directions-reverse");
    const suggestions = document.querySelectorAll(".suggestions");

    swapButton.addEventListener("click", () => {
      suggestions.forEach((element) => {
        element.style.visibility = "initial";
      });
    });
  }

  #changeInputPlaceholder() {
    const searchBox = document.querySelector(".mapboxgl-ctrl-geocoder--input");
    searchBox.placeholder = "Enter a location";
  }

  #noRouteFoundMessage() {
    const alert = document.createElement("div");
    alert.classList.add(
      "alert-dismissible",
      "alert",
      "alert-info",
      "fade",
      "fade",
      "m-1",
      "route__alert"
    );
    alert.innerHTML = `No route found`;
    alert.style.bottom = "5rem";
    const main = document.querySelector("main");
    main.appendChild(alert);
  }
}
