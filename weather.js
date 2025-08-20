async function getCities() {
  try {
    const response = await fetch('https://tiles.wo-cloud.com/snippet-tiles?bounds=35,63,3,90&format=webp&geosvg=true&height=338&highres=true&layergroup=WetterRadar&locale=en-IN&width=600'); // <-- replace with real JSON API
    const data = await response.json();

    // store cities in a variable
    const cities = data.cities.map(city => city.name);

    console.log("Cities:", cities);
    return cities; // return so you can use it later
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }

  
}
function displayCities(cities) {
  const inputField = document.getElementById("weatherInput");
  let html = "<ul>";

  cities.forEach(city => {
    html += `<li>${city}</li>`;
  });

  html += "</ul>";
  inputField.innerHTML = html;
}

getCities();
