let map;
let marker;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 13,
    });

    marker = new google.maps.Marker({
        position: { lat: 37.7749, lng: -122.4194 },
        map: map,
        draggable: true,
    });

    google.maps.event.addListener(marker, "dragend", function (event) {
        document.getElementById("location").value = event.latLng.lat() + ", " + event.latLng.lng();
    });
}

document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const location = document.getElementById("location").value;
    const mobile = document.getElementById("mobile").value;
    const vehicle = document.getElementById("vehicle").value;
    const description = document.getElementById("description").value;

    console.log("Name: " + name);
    console.log("Location: " + location);
    console.log("Mobile: " + mobile);
    console.log("Vehicle: " + vehicle);
    console.log("Description: " + description);
});