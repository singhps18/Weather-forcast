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
  document.body.style.setProperty("--bg-url", `url('')`);
  document.body.style.setProperty("--bg-url", bg.replace("url('", "url('")); 
}


const apiKeys = "61b9c083533ed5703b184ec1f5fcc5c9";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=kuwait";
async function checkWeather() {
  try {
    const apiResponse = await fetch(apiUrl + `&appid=${apiKeys}`);
    const data = await apiResponse.json();
    console.log("API Data:", data);

    const update = (selector, value) => {
      const el = document.querySelector(selector);
      if (el) el.innerHTML = value;
    };

    update(".city", "Weather " + data.name);
    update(".tem", `🌡️ ${data.main.temp} °C`);
    update(".humidity", `💧 ${data.main.humidity}%`);
    update(".mainWeather", data.weather[0].main);
    update(".todayDate", new Date(data.dt * 1000).toLocaleDateString());
    update(".country", data.sys.country);
    update(".description", data.weather[0].description);
    update(".rain", data.rain ? data.rain["1h"] + " mm" : "No rain");
    update(".windspeed", `💨 ${data.wind.speed} m/s`);
    update(".winddirection", ` ${data.wind.deg}°`);
    update(".tempRange", ` ${data.main.temp_min.toFixed(1)}°C / ${data.main.temp_max.toFixed(1)}°C`
);


    setBackgroundByCondition(data.weather[0].main || "");
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

async function getForecast(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=61b9c083533ed5703b184ec1f5fcc5c9&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    const dailyForecast = data.list.filter(f => f.dt_txt.includes("12:00:00"));

    displayForecast(dailyForecast);
  } catch (err) {
    console.error("Forecast error:", err);
  }
}

function displayForecast(list) {
  const forecastContainer = document.querySelector("#forecast");
  forecastContainer.innerHTML = ""; 

  list.forEach(day => {
    const date = new Date(day.dt * 1000);
    const options = { weekday: "short", month: "short", day: "numeric" };
    const dateStr = date.toLocaleDateString(undefined, options);

    const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
    const desc = day.weather[0].description;
    const temp = day.main.temp.toFixed(1);
    const humidity = day.main.humidity;
    const wind = day.wind.speed.toFixed(1);
    const min = day.main.temp_min.toFixed(1);
    const max = day.main.temp_max.toFixed(1);

    const card = `
      <div class="rounded-2xl p-4 grid gap-2 border-[#ffbe00] border"
           style="background-color: rgba(74, 113, 113, 1);">
         <div class="text-sm opacity-80">${dateStr}</div>
         <div class="flex items-center gap-2">
             <img src="${icon}" alt="cond" class="w-10 h-10">
             <div class="font-semibold">${temp}°C</div>
         </div>
         <div class="text-xs opacity-80">${day.weather[0].main} (${desc})</div>
         <div class="grid grid-cols-3 gap-2 text-xs">
             <div class="rounded-lg bg-white/5 p-2">
                 <div class="opacity-70">Hum</div>
                 <div class="font-semibold">${humidity}%</div>
             </div>
             <div class="rounded-lg bg-white/5 p-2">
                 <div class="opacity-70">Wind</div>
                 <div class="font-semibold">${wind} m/s</div>
             </div>
             <div class="rounded-lg bg-white/5 p-2">
                 <div class="opacity-70">Min/Max</div>
                 <div class="font-semibold">${min}°C / ${max}°C</div>
             </div>
         </div>
      </div>
    `;

    forecastContainer.innerHTML += card;
  });
}

// call function
getForecast("kuwait");


checkWeather();































