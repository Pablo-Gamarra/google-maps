'use strict'

let map
let marker

// Inicializacion del mapa
function initMap(location) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
    })

    // Ejemplo de ubicacion de marcador por defecto
    placeMarker(location, map)

    // Creacion de caja de busqueda 
    const searchBox = new google.maps.places.SearchBox(
        document.getElementById('search-box')
    )

    // Acotar busquedas a los limites del mapa
    map.addListener('bounds_changed', () => {
        searchBox.setBounds(map.getBounds())
    })

    // Evento click para actualizar el marcador
    map.addListener('click', event => {
        placeMarker(event.latLng, map)
    })

    // Evento cuando cambia la busqueda del usuario
    searchBox.addListener('places_changed', () => {
        // Obtencion de ubicaciones de la caja de busqueda
        const places = searchBox.getPlaces()

        if (places.length === 0) {
            return
        }

        const bounds = new google.maps.LatLngBounds()

        // Por cada ubicacion, se expanden los bounds del mapa
        places.forEach(place => {
            if (!place.geometry || !place.geometry.location) {
                console.info('El sitio retornado no tiene geometria')
                return
            }

            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport)
            } else {
                bounds.extend(place.geometry.location)
            }
        })

        map.fitBounds(bounds)
    })
}

// Dada una ubicacion, agrega un marcador en el mapa
function placeMarker(position, map) {
    // Si habia un marcador agregado previamente, le desasigna el mapa
    if (marker) {
        marker.setMap(null)
    }

    // Crea un nuevo marcador
    marker = new google.maps.Marker({
        position: position,
        map: map
    })
}

// Funcion invocada cuando google maps esta listo para ser utilizado
function googleMapsCallback() {
    // Coordenadas utilizadas para centrar el mapa inicialmente
    const defaultLocation = { lat: -33.8688, lng: 151.2195 }

    // Si la geolocalizacion esta habilitada
    if (navigator.geolocation) {
        // Se obtiene la posicion actual y se usa como ubicacion inicial
        navigator.geolocation.getCurrentPosition(position => {
            initMap(new google.maps.LatLng(position.coords.latitude, position.coords.longitude))
        }, error => { // Se utilizan las coordenadas por defecto si hay error
            console.error(error)
            initMap(defaultLocation)
        })
    } else {
        // Se utilizan las coordenadas por defecto si la geolocalizacion no esta activada
        initMap(defaultLocation)
    }
}
