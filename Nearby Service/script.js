document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");
  const sortRating = document.getElementById("sort-rating");
  const sortDistance = document.getElementById("sort-distance"); // Get the new select element
  const searchBtn = document.getElementById("search-btn");
  const currentLocationBtn = document.getElementById("current-location-btn");
  const searchAddressInput = document.getElementById("search-address");
  const locationHeading = document.getElementById("location-heading");

  let mechanics = [];
  // IMPORTANT: Replace with your real Google Maps API key if you want to use the official endpoint.
  // const apiKey = "YOUR_GOOGLE_MAPS_API_KEY";
  // And use 'https://maps.googleapis.com/maps/api/...' instead of 'https://maps.gomaps.pro/maps/api/...'
  const apiKey = "AlzaSy-tUgCWFuDyffGAus9mK-qKQkDXaiz093C";   //REPLACE WITH YOUR KEY

  const fetchMechanics = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.gomaps.pro/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&type=car_repair&language=en&key=${apiKey}`
      );
      const data = await response.json();

      mechanics = data.results.map((place) => ({
        Name: place.name || "N/A",
        Rating: place.rating ? `${place.rating}` : "N/A",
        Address: place.vicinity || "N/A",
        "Mobile number": place.formatted_phone_number || "N/A",
        Price: place.price_level ? `$${place.price_level}` : "N/A",
        Lat: place.geometry.location.lat,
        Lng: place.geometry.location.lng,
      }));

      // Fetch distances using Distance Matrix API
      const origins = `${lat},${lng}`;
      const destinations = mechanics.map(m => `${m.Lat},${m.Lng}`).join('|');
      const distanceResponse = await fetch(
        `https://maps.gomaps.pro/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${apiKey}`
      );
      const distanceData = await distanceResponse.json();
      if (distanceData.status === "OK") {
        distanceData.rows[0].elements.forEach((element, index) => {
          if (element.status === "OK") {
            mechanics[index].Distance = element.distance.value; // Distance in meters
            mechanics[index].DistanceText = element.distance.text; // e.g., "5.4 km"
          } else {
            mechanics[index].Distance = Infinity; // Set to a large number if distance is unavailable
            mechanics[index].DistanceText = "N/A";
          }
        });
      } else {
        mechanics.forEach(m => {
          m.Distance = Infinity;
          m.DistanceText = "N/A";
        });
      }

      // Update the heading with the location name
      const locationName = await reverseGeocode(lat, lng);
      locationHeading.innerText = `Nearby Mechanics in ${locationName}`;

      renderProducts(mechanics);
    } catch (error) {
      console.error("Error fetching mechanics data:", error);
      productList.innerHTML = `<p class="text-red-500">Failed to load mechanics data. Please try again later.</p>`;
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.gomaps.pro/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data = await response.json();
      if (data.status === "OK") {
        const components = data.results[0].address_components;
        let city = "your area";
        for (const component of components) {
          if (component.types.includes("locality") || component.types.includes("administrative_area_level_1")) {
            city = component.long_name;
            break;
          }
        }
        return city;
      } else {
        return "your area";
      }
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      return "your area";
    }
  };

  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://maps.gomaps.pro/maps/api/geocode/json?language=en&address=${encodeURIComponent(
          address
        )}&key=${apiKey}`
      );
      const data = await response.json();
      if (data.status === "OK") {
        const { lat, lng } = data.results[0].geometry.location;
        // Only update heading if address is found
        const locationName = data.results[0].formatted_address;
        locationHeading.innerText = `Nearby Mechanics in ${locationName}`;
        fetchMechanics(lat, lng);
      } else {
        alert("Address not found. Please try another address.");
      }
    } catch (error) {
      console.error("Error fetching geocode data:", error);
      alert("Failed to fetch geocode data. Please try again.");
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchMechanics(latitude, longitude);
        },
        (error) => {
          console.error("Error getting current location:", error);
          alert("Failed to get current location. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const renderProducts = (mechanics) => {
    productList.innerHTML = "";
    mechanics.forEach((mechanic, index) => {
      const productCard = document.createElement("div");
      productCard.className =
        "transform bg-white rounded-lg shadow-md p-6 flex flex-col justify-between hover:-translate-y-2 hover:shadow-lg transition-transform duration-300";

      productCard.innerHTML = `
        <div>
          <h2 class="text-lg font-bold text-blue-600 mb-2">${mechanic.Name}</h2>
          <div class="rating-section flex items-center mb-2">
            <span class="rating bg-green-500 text-white px-2 py-1 rounded mr-2">${mechanic.Rating}★</span>
            <span class="reviews text-gray-600">${mechanic.Address}</span>
          </div>
          <div class="distance text-gray-600 mb-4">Distance: ${mechanic.DistanceText || "N/A"}</div>
        </div>
        <button class="book-now bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700" data-id="${index}">Book Now</button>
      `;

      productList.appendChild(productCard);

      const bookNowButton = productCard.querySelector(".book-now");
      bookNowButton.addEventListener("click", () => {
        const selectedMechanic = mechanics[index];
        const name = encodeURIComponent(selectedMechanic.Name);
        const rating = encodeURIComponent(selectedMechanic.Rating);
        const address = encodeURIComponent(selectedMechanic.Address);
        window.location.href = `./orderconfirm/order-summary.html?name=${name}&rating=${rating}&address=${address}`;
      });
    });
  };

  const sortMechanics = () => {
    let sortedMechanics = [...mechanics];
  
    sortedMechanics.sort((a, b) => {
      // Initialize result variables for each sort criterion
      let distanceResult = 0;
      let ratingResult = 0;
  
      // Sort by distance if selected
      if (sortDistance.value) {
        const distanceA = a.Distance || Infinity;
        const distanceB = b.Distance || Infinity;
        distanceResult = sortDistance.value === 'asc' ? distanceA - distanceB : distanceB - distanceA;
      }
  
      // Sort by rating if selected
      if (sortRating.value) {
        const ratingA = parseFloat(a.Rating) || 0;
        const ratingB = parseFloat(b.Rating) || 0;
        ratingResult = sortRating.value === 'asc' ? ratingA - ratingB : ratingB - ratingA;
      }
  
      // Combine the sorting criteria
      if (distanceResult !== 0) {
        return distanceResult;
      } else if (ratingResult !== 0) {
        return ratingResult;
      } else {
        return 0;
      }
    });
  
    renderProducts(sortedMechanics);
  };
  

  // Add event listeners for both sort options
  sortRating.addEventListener("change", sortMechanics);
  sortDistance.addEventListener("change", sortMechanics);

  searchBtn.addEventListener("click", () => {
    const address = searchAddressInput.value.trim();
    if (address) {
      geocodeAddress(address);
    } else {
      alert("Please enter an address.");
    }
  });

  currentLocationBtn.addEventListener("click", getCurrentLocation);

  // Default fetch with predefined location
  fetchMechanics(23.259933, 77.412613);
});
