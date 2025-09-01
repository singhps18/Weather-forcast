
const API_KEY = "61b9c083533ed5703b184ec1f5fcc5c9";


const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locBtn = document.getElementById("locBtn");
const unitToggle = document.getElementById("unitToggle");
const recentToggle = document.getElementById("recentToggle");
const recentChevron = document.getElementById("recentChevron");
const recentList = document.getElementById("recentList");

const alertBox = document.getElementById("alertBox");
const errorBox = document.getElementById("errorBox");

const cityTitle = document.getElementById("cityTitle");
const dateTitle = document.getElementById("dateTitle");
const todayIcon = document.getElementById("todayIcon");
const todayTemp = document.getElementById("todayTemp");
const todayFeels = document.getElementById("todayFeels");
const todayHumidity = document.getElementById("todayHumidity");
const todayWind = document.getElementById("todayWind");
const todayCond = document.getElementById("todayCond");
const todayPress = document.getElementById("todayPress");
const todayVis = document.getElementById("todayVis");
const todayCloud = document.getElementById("todayCloud");
const forecastGrid = document.getElementById("forecastGrid");

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

function formatDate(ts, tzOffsetSec = 0) {
  try {
    // ts in seconds; tzOffsetSec in seconds from API
    const date = new Date((ts + tzOffsetSec) * 1000);
    return date.toLocaleString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove("hidden");
  setTimeout(() => errorBox.classList.add("hidden"), 4000);
}

function showAlert(msg) {
  alertBox.textContent = msg;
  alertBox.classList.remove("hidden");
  setTimeout(() => alertBox.classList.add("hidden"), 4000);
}

function saveRecent(city) {
  const key = "recentCities";
  const list = JSON.parse(localStorage.getItem(key) || "[]");
  const existingIdx = list.findIndex(c => c.toLowerCase() === city.toLowerCase());
  if (existingIdx !== -1) list.splice(existingIdx, 1);
  list.unshift(city);
  const trimmed = list.slice(0, 8);
  localStorage.setItem(key, JSON.stringify(trimmed));
  renderRecent();
}

function getRecent() {
  try {
    return JSON.parse(localStorage.getItem("recentCities") || "[]");
  } catch {
    return [];
  }
}

function renderRecent() {
  const cities = getRecent();
  recentList.innerHTML = "";
  if (!cities.length) {
    recentToggle.classList.add("opacity-50", "cursor-not-allowed");
    recentToggle.setAttribute("disabled", "true");
    recentList.classList.add("hidden");
    return;
  }
  recentToggle.classList.remove("opacity-50", "cursor-not-allowed");
  recentToggle.removeAttribute("disabled");

  cities.forEach(city => {
    const li = document.createElement("li");
    li.className = "rounded-lg hover:bg-white/10 transition";
    const btn = document.createElement("button");
    btn.className = "w-full text-left px-3 py-2";
    btn.textContent = city;
    btn.addEventListener("click", () => {
      recentList.classList.add("hidden");
      recentChevron.style.transform = "rotate(0deg)";
      fetchByCity(city);
    });
    li.appendChild(btn);
    recentList.appendChild(li);
  });
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

async function fetchCurrentWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  return fetchJSON(url);
}

async function fetchForecastByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  return fetchJSON(url);
}

async function fetchCurrentWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  return fetchJSON(url);
}

async function fetchForecastByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  return fetchJSON(url);
}

function cToF(c) { return (c * 9/5) + 32; }

function renderToday(data) {
  const { name, sys, weather, main, wind, visibility, clouds, dt, timezone } = data;
  const cond = weather?.[0] || {};
  cityTitle.textContent = `${name || ""}${sys?.country ? ", " + sys.country : ""}`.trim() || "—";
  dateTitle.textContent = formatDate(dt, timezone || 0);
  todayIcon.src = `https://openweathermap.org/img/wn/${cond.icon || "01d"}@2x.png`;
  todayIcon.alt = cond.description || "weather icon";
  todayCond.textContent = cond.main ? `${cond.main} (${cond.description || ""})` : "—";

  const tempC = typeof main?.temp === "number" ? main.temp : NaN;
  const feelsC = typeof main?.feels_like === "number" ? main.feels_like : NaN;
  const showF = unitToggle.checked;
  const t = showF ? `${Math.round(cToF(tempC))}°F` : `${Math.round(tempC)}°C`;
  const f = showF ? `${Math.round(cToF(feelsC))}°F` : `${Math.round(feelsC)}°C`;
  todayTemp.textContent = isNaN(tempC) ? "—" : t;
  todayFeels.textContent = isNaN(feelsC) ? "—" : f;

  todayHumidity.textContent = typeof main?.humidity === "number" ? `${main.humidity}%` : "—";
  todayWind.textContent = typeof wind?.speed === "number" ? `${wind.speed} m/s` : "—";
  todayPress.textContent = typeof main?.pressure === "number" ? `${main.pressure} hPa` : "—";
  todayVis.textContent = typeof visibility === "number" ? `${Math.round(visibility/1000)} km` : "—";
  todayCloud.textContent = typeof clouds?.all === "number" ? `${clouds.all}%` : "—";

  setBackgroundByCondition(cond.main || "");


  if (typeof tempC === "number" && tempC > 40) {
    showAlert("Extreme heat alert: temperature is above 40°C today!");
  }
}

function groupForecastByDay(list) {

  const byDay = {};
  list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const key = date.toISOString().slice(0, 10);// YYYY-MM-DD
    byDay[key] = byDay[key] || [];
    byDay[key].push(item);
  });

  const days = Object.keys(byDay).sort();
  const picks = [];
  days.forEach(d => {

    const targetHour = 12;
    const arr = byDay[d];
    arr.sort((a, b) => Math.abs(new Date(a.dt*1000).getHours() - targetHour) - Math.abs(new Date(b.dt*1000).getHours() - targetHour));
    picks.push(arr[0]);
  });
  return picks.slice(0, 5);
}

function renderForecast(data) {
  const picks = groupForecastByDay(data.list || []);
  forecastGrid.innerHTML = "";

  picks.forEach(item => {
    const date = new Date(item.dt * 1000);
    const w = item.weather?.[0] || {};
    const m = item.main || {};
    const wind = item.wind || {};
    const card = document.createElement("div");
    card.className = "rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 grid gap-2";
    card.innerHTML = `
      <div class="text-sm opacity-80">${date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</div>
      <div class="flex items-center gap-2">
        <img src="https://openweathermap.org/img/wn/${w.icon || "01d"}@2x.png" alt="cond" class="w-10 h-10" />
        <div class="font-semibold">${Math.round(m.temp)}°C</div>
      </div>
      <div class="text-xs opacity-80">${w.main || ""} ${w.description ? "(" + w.description + ")" : ""}</div>
      <div class="grid grid-cols-3 gap-2 text-xs">
        <div class="rounded-lg bg-white/5 p-2"><div class="opacity-70">Hum</div><div class="font-semibold">${m.humidity ?? "—"}%</div></div>
        <div class="rounded-lg bg-white/5 p-2"><div class="opacity-70">Wind</div><div class="font-semibold">${wind.speed ?? "—"} m/s</div></div>
        <div class="rounded-lg bg-white/5 p-2"><div class="opacity-70">Min/Max</div><div class="font-semibold">${Math.round(m.temp_min)}° / ${Math.round(m.temp_max)}°</div></div>
      </div>
    `;
    forecastGrid.appendChild(card);
  });
}

async function fetchByCity(city) {
  const q = city?.trim();
  if (!q) return showError("Please enter a city name.");
  try {
    errorBox.classList.add("hidden");
    const [today, forecast] = await Promise.all([
      fetchCurrentWeatherByCity(q),
      fetchForecastByCity(q)
    ]);
    renderToday(today);
    renderForecast(forecast);
    saveRecent(today.name || q);
  } catch (e) {
    showError("Could not fetch weather for that city. Please check the name and try again.");
    console.error(e);
  }
}

async function fetchByLocation() {
  if (!navigator.geolocation) {
    return showError("Geolocation is not supported by your browser.");
  }
  navigator.geolocation.getCurrentPosition(async (pos) => {
    try {
      const { latitude, longitude } = pos.coords;
      const [today, forecast] = await Promise.all([
        fetchCurrentWeatherByCoords(latitude, longitude),
        fetchForecastByCoords(latitude, longitude)
      ]);
      renderToday(today);
      renderForecast(forecast);
      if (today.name) saveRecent(today.name);
    } catch (e) {
      showError("Unable to get weather for your location.");
      console.error(e);
    }
  }, (err) => {
    showError("Location permission denied or unavailable.");
    console.error(err);
  }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
}


searchBtn.addEventListener("click", () => fetchByCity(cityInput.value));
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") fetchByCity(cityInput.value);
});
locBtn.addEventListener("click", fetchByLocation);

unitToggle.addEventListener("change", () => {

  if (window.__lastToday) renderToday(window.__lastToday);
});

recentToggle.addEventListener("click", () => {
  if (recentList.classList.contains("hidden")) {
    recentList.classList.remove("hidden");
    recentChevron.style.transform = "rotate(180deg)";
  } else {
    recentList.classList.add("hidden");
    recentChevron.style.transform = "rotate(0deg)";
  }
});


function interceptRenderToday() {
  const _renderToday = renderToday;
  renderToday = function(data) {
    window.__lastToday = data;
    return _renderToday(data);
  }
}
interceptRenderToday();


renderRecent();
fetchByCity("Mumbai");
