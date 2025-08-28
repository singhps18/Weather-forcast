const BGs = {
  clear: "linear-gradient(135deg, rgba(29,78,216,0.25), rgba(8,145,178,0.25)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1974&auto=format&fit=crop')",
  clouds: "linear-gradient(135deg, rgba(2,6,23,0.35), rgba(30,41,59,0.35)), url('https://images.unsplash.com/photo-1505483531331-64546868b590?q=80&w=1974&auto=format&fit=crop')",
  rain: "linear-gradient(135deg, rgba(2,6,23,0.45), rgba(30,41,59,0.45)), url('https://images.unsplash.com/photo-1495696149910-3d3aefca41e9?q=80&w=1974&auto=format&fit=crop')",
  drizzle: "linear-gradient(135deg, rgba(2,6,23,0.45), rgba(30,41,59,0.45)), url('https://images.unsplash.com/photo-1444384851176-6e23071c6127?q=80&w=1974&auto=format&fit=crop')",
  thunder: "linear-gradient(135deg, rgba(2,6,23,0.5), rgba(30,41,59,0.5)), url('https://images.unsplash.com/photo-1500674425229-f692875b0ab7?q=80&w=1974&auto=format&fit=crop')",
  snow: "linear-gradient(135deg, rgba(14,165,233,0.25), rgba(125,211,252,0.25)), url('https://images.unsplash.com/photo-1516570161787-2fd917215a3d?q=80&w=1974&auto=format&fit=crop')",
  mist: "linear-gradient(135deg, rgba(2,6,23,0.35), rgba(71,85,105,0.35)), url('https://images.unsplash.com/photo-1499343245400-cddc78a01317?q=80&w=1974&auto=format&fit=crop')",
};

function setBackgroundByCondition(main) {
  const key = (main || "").toLowerCase();
  let bg = BGs.clear;
  if (key.includes("cloud")) bg = BGs.clouds;
  else if (key.includes("rain")) bg = BGs.rain;
  else if (key.includes("drizzle")) bg = BGs.drizzle;
  else if (key.includes("thunder")) bg = BGs.thunder;
  else if (key.includes("snow")) bg = BGs.snow;
  else if (key.includes("mist") || key.includes("fog") || key.includes("haze")) bg = BGs.mist;

  document.documentElement.style.setProperty("--bg-url", `url('data:image/svg+xml;utf8,')`);
  document.body.style.setProperty("--bg-url", `url('')`); // reset to ensure transition
  document.body.style.setProperty("--bg-url", bg.replace("url('", "url('")); // set
}


const apiKeys = "61b9c083533ed5703b184ec1f5fcc5c9";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=kuwait";
async function checkWeather() {
  try {
    const apiResponse = await fetch(apiUrl + `&appid=${apiKeys}`);
    const data = await apiResponse.json();
    // Update DOM
    document.querySelector(".city").innerHTML = "Weather" +" " +data.name;
    document.querySelector(".tem").innerHTML = `🌡️ ${data.main.temp} °C`;
    document.querySelector(".humidity").innerHTML = `💧 ${data.main.humidity}%`;
   document.querySelector(".mainWeather").innerHTML =  data.weather[0].main;;
    document.querySelector(".todayDate").innerHTML = new Date(data.dt * 1000).toLocaleDateString(); 
    document.querySelector(".country").innerHTML =  data.sys.country;
    document.querySelector(".sunrise").innerHTML =  new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    document.querySelector(".sunset").innerHTML = new Date(data.sys.sunset * 1000).toLocaleTimeString();
      document.querySelector(".description").innerHTML= data.weather[0].description;
   document.querySelector(".rain").innerHTML = data.rain;
 document.querySelector(".windspeed").innerHTML = `💨 ${data.wind.speed} m/s`;
document.querySelector(".winddirection").innerHTML = `🧭 ${data.wind.deg}°`;



  setBackgroundByCondition(data.weather[0].main|| "");
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

checkWeather();































