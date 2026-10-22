// DOM Elements Selection
var dateInput = document.getElementById("apod-date-input");
var loadBtn = document.getElementById("load-date-btn");
var todayBtn = document.getElementById("today-apod-btn");
var dateLabel = document.querySelector(".date-input-wrapper span");

var title = document.getElementById("apod-title");
var dateHeader = document.getElementById("apod-date");
var dateDetail = document.getElementById("apod-date-detail");
var dateInfo = document.getElementById("apod-date-info");
var explanation = document.getElementById("apod-explanation");
var copyright = document.getElementById("apod-copyright");
var image = document.getElementById("apod-image");
var mediaType = document.getElementById("apod-media-type");
var loading = document.getElementById("apod-loading");

var launchesCountEl = document.getElementById("launches-count");
var launchesCountMobileEl = document.getElementById("launches-count-mobile");
var featuredLaunchContainer = document.getElementById("featured-launch");
var launchesGrid = document.getElementById("launches-grid");

var planetDetailName = document.getElementById("planet-detail-name");
var planetDetailImage = document.getElementById("planet-detail-image");
var planetDistance = document.getElementById("planet-distance");
var planetRadius = document.getElementById("planet-radius");
var planetMass = document.getElementById("planet-mass");
var planetDensity = document.getElementById("planet-density");
var planetOrbitalPeriod = document.getElementById("planet-orbital-period");
var planetRotation = document.getElementById("planet-rotation");
var planetMoons = document.getElementById("planet-moons");
var planetGravity = document.getElementById("planet-gravity");
var planetDiscoverer = document.getElementById("planet-discoverer");
var planetDiscoveryDate = document.getElementById("planet-discovery-date");
var planetBodyType = document.getElementById("planet-body-type");
var planetVolume = document.getElementById("planet-volume");
var planetPerihelion = document.getElementById("planet-perihelion");
var planetAphelion = document.getElementById("planet-aphelion");
var planetEccentricity = document.getElementById("planet-eccentricity");
var planetInclination = document.getElementById("planet-inclination");
var planetTemp = document.getElementById("planet-temp");
var planetEscape = document.getElementById("planet-escape");
var planetsGrid = document.getElementById("planets-grid");
var planetComparisonTbody = document.getElementById("planet-comparison-tbody");

var navLinks = document.querySelectorAll(".nav-link");
var appSections = document.querySelectorAll(".app-section");

// Global API & Data Variables
var apiKey = "bU7WaOFtMVnWeJGvbySkFHQt5WestD49c69xOgQa";
var LAUNCHES_API_URL = "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=10";
var PLANETS_API_URL = "https://solar-system-opendata-proxy.vercel.app/api/planets";
var PLANETS_TOKEN = "bU7WaOFtMVnWeJGvbySkFHQt5WestD49c69xOg";

var launchesList = [];
var planetsList = [];

var planetColors = {
  mercury: "#eab308",
  venus: "#f97316",
  earth: "#3b82f6",
  mars: "#ef4444",
  jupiter: "#fb923c",
  saturn: "#facc15",
  uranus: "#06b6d4",
  neptune: "#2563eb",
};

// Initial App Execution
document.addEventListener("DOMContentLoaded", function () {
  var today = getTodayDate();
  if (dateInput) {
    dateInput.max = today;
    var initialDate = dateInput.value || today;
    getApod(initialDate);
  } else {
    getApod(today);
  }

  getLaunches();
  getPlanets();
  setupNavigation();
});

// Navigation Functions
function setupNavigation() {
  for (var i = 0; i < navLinks.length; i++) {
    (function (index) {
      navLinks[index].addEventListener("click", function (e) {
        e.preventDefault();
        var targetSectionId = navLinks[index].getAttribute("data-section");
        if (targetSectionId) {
          switchSection(targetSectionId);
        }
      });
    })(i);
  }
}

function switchSection(targetSectionId) {
  for (var i = 0; i < appSections.length; i++) {
    appSections[i].classList.add("hidden");
  }

  var activeSection = document.getElementById(targetSectionId);
  if (activeSection) {
    activeSection.classList.remove("hidden");
  }

  for (var j = 0; j < navLinks.length; j++) {
    var link = navLinks[j];
    var isTarget = link.getAttribute("data-section") === targetSectionId;

    if (isTarget) {
      link.classList.add("bg-blue-500/10", "text-blue-400");
      link.classList.remove("text-slate-300", "hover:bg-slate-800");
    } else {
      link.classList.remove("bg-blue-500/10", "text-blue-400");
      link.classList.add("text-slate-300", "hover:bg-slate-800");
    }
  }
}

// APOD Module
function getTodayDate() {
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var day = today.getDate();

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  return year + "-" + month + "-" + day;
}

function formatApodDate(dateString) {
  var parts = dateString.split("-");
  var year = Number(parts[0]);
  var month = Number(parts[1]);
  var day = Number(parts[2]);

  var date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getApod(date) {
  if (loading) loading.classList.remove("hidden");

  var url = "https://api.nasa.gov/planetary/apod?api_key=" + apiKey + "&date=" + date;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);

  xhr.onload = function () {
    if (loading) loading.classList.add("hidden");

    if (xhr.status >= 200 && xhr.status < 300) {
      var data = JSON.parse(xhr.responseText);
      displayApod(data);
    } else {
      alert("Could not load Astronomy Picture of the Day for the selected date.");
    }
  };

  xhr.onerror = function () {
    if (loading) loading.classList.add("hidden");
    alert("Could not load Astronomy Picture of the Day for the selected date.");
  };

  xhr.send();
}

function displayApod(data) {
  var formattedDate = formatApodDate(data.date);

  if (title) title.textContent = data.title;
  if (explanation) explanation.textContent = data.explanation;
  if (dateHeader) dateHeader.textContent = "Astronomy Picture of the Day - " + formattedDate;
  if (dateDetail) dateDetail.innerHTML = '<i class="far fa-calendar mr-2"></i>' + data.date;
  if (dateInfo) dateInfo.textContent = data.date;
  if (mediaType) mediaType.textContent = data.media_type;

  if (copyright) {
    if (data.copyright) {
      copyright.textContent = "© " + data.copyright;
    } else {
      copyright.textContent = "© Public Domain / NASA";
    }
  }

  if (image) {
    if (data.media_type === "image") {
      image.src = data.url;
      image.alt = data.title;
    } else if (data.media_type === "video") {
      if (data.thumbnail_url) {
        image.src = data.thumbnail_url;
      } else {
        image.src = "./assets/images/placeholder.webp";
      }
      image.alt = data.title;
    }
  }

  if (dateLabel) {
    dateLabel.textContent = formattedDate;
  }
}

if (loadBtn) {
  loadBtn.addEventListener("click", function () {
    var date = dateInput.value;
    if (date) {
      getApod(date);
    }
  });
}

if (todayBtn) {
  todayBtn.addEventListener("click", function () {
    var today = getTodayDate();
    dateInput.value = today;
    getApod(today);
  });
}

// Launches Module
function formatLaunchDate(dateStr) {
  if (!dateStr) return "TBD";
  var d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatLaunchTime(dateStr) {
  if (!dateStr) return "TBD";
  var d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function getDaysUntil(dateStr) {
  if (!dateStr) return "N/A";
  var now = new Date();
  var launchDate = new Date(dateStr);
  var diff = launchDate - now;
  var days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
}

function getLaunches() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", LAUNCHES_API_URL, true);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      var json = JSON.parse(xhr.responseText);
      launchesList = json.results || [];

      if (launchesList.length > 0) {
        displayFeaturedLaunch(launchesList[0]);

        var remainingLaunches = [];
        for (var i = 1; i < launchesList.length; i++) {
          remainingLaunches.push(launchesList[i]);
        }
        displayLaunchesGrid(remainingLaunches);
      }

      if (launchesCountEl) launchesCountEl.textContent = launchesList.length + " Launches";
      if (launchesCountMobileEl) launchesCountMobileEl.textContent = launchesList.length;
    }
  };

  xhr.send();
}

function displayFeaturedLaunch(item) {
  if (!featuredLaunchContainer) return;

  var name = item.name || "Upcoming Mission";
  var agency = item.launch_service_provider && item.launch_service_provider.name ? item.launch_service_provider.name : "Unknown Agency";
  var rocket = item.rocket && item.rocket.configuration && item.rocket.configuration.name ? item.rocket.configuration.name : "Rocket";
  var location = item.pad && item.pad.location && item.pad.location.name ? item.pad.location.name : "Unknown Location";
  var country = item.pad && item.pad.location && item.pad.location.country_code ? item.pad.location.country_code : "N/A";
  var date = formatLaunchDate(item.net);
  var time = formatLaunchTime(item.net);
  var days = getDaysUntil(item.net);
  var status = item.status && item.status.abbrev ? item.status.abbrev : "Go";
  var desc = item.mission && item.mission.description ? item.mission.description : "No mission description available for this launch.";

  var img = item.image || (item.rocket && item.rocket.configuration && item.rocket.configuration.image_url) || "";
  var imageHtml = img
    ? `<img src="${img}" alt="${name}" class="w-full h-full object-cover" />`
    : `<i class="fas fa-rocket text-9xl text-slate-700/50"></i>`;

  var box = `<div class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all">
    <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
      <div class="flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <span class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2">
              <i class="fas fa-star"></i> Featured Launch
            </span>
            <span class="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">${status}</span>
          </div>
          <h3 class="text-3xl font-bold mb-3 leading-tight">${name}</h3>
          <div class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400">
            <div class="flex items-center gap-2"><i class="fas fa-building"></i> <span>${agency}</span></div>
            <div class="flex items-center gap-2"><i class="fas fa-rocket"></i> <span>${rocket}</span></div>
          </div>
          <div class="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6">
            <i class="fas fa-clock text-2xl text-blue-400"></i>
            <div>
              <p class="text-2xl font-bold text-blue-400">${days}</p>
              <p class="text-xs text-slate-400">Days Until Launch</p>
            </div>
          </div>
          <div class="grid xl:grid-cols-2 gap-4 mb-6">
            <div class="bg-slate-900/50 rounded-xl p-4">
              <p class="text-xs text-slate-400 mb-1 flex items-center gap-2"><i class="fas fa-calendar"></i> Launch Date</p>
              <p class="font-semibold">${date}</p>
            </div>
            <div class="bg-slate-900/50 rounded-xl p-4">
              <p class="text-xs text-slate-400 mb-1 flex items-center gap-2"><i class="fas fa-clock"></i> Launch Time</p>
              <p class="font-semibold">${time}</p>
            </div>
            <div class="bg-slate-900/50 rounded-xl p-4">
              <p class="text-xs text-slate-400 mb-1 flex items-center gap-2"><i class="fas fa-map-marker-alt"></i> Location</p>
              <p class="font-semibold text-sm line-clamp-1">${location}</p>
            </div>
            <div class="bg-slate-900/50 rounded-xl p-4">
              <p class="text-xs text-slate-400 mb-1 flex items-center gap-2"><i class="fas fa-globe"></i> Country</p>
              <p class="font-semibold">${country}</p>
            </div>
          </div>
          <p class="text-slate-300 leading-relaxed mb-6 line-clamp-3">${desc}</p>
        </div>
        <div class="flex flex-col md:flex-row gap-3">
          <button class="flex-1 px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2">
            <i class="fas fa-info-circle"></i> View Full Details
          </button>
        </div>
      </div>
      <div class="relative">
        <div class="relative h-full min-h-[350px] rounded-2xl overflow-hidden bg-slate-900/50 flex items-center justify-center">${imageHtml}</div>
      </div>
    </div>
  </div>`;

  featuredLaunchContainer.innerHTML = box;
}

function displayLaunchesGrid(items) {
  if (!launchesGrid) return;

  var box = "";

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var name = item.name || "Upcoming Launch";
    var agency = item.launch_service_provider && item.launch_service_provider.name ? item.launch_service_provider.name : "Unknown Agency";
    var rocket = item.rocket && item.rocket.configuration && item.rocket.configuration.name ? item.rocket.configuration.name : "Rocket";
    var location = item.pad && item.pad.name ? item.pad.name : "Unknown Location";
    var date = formatLaunchDate(item.net);
    var time = formatLaunchTime(item.net);
    var status = item.status && item.status.abbrev ? item.status.abbrev : "TBD";

    var img = item.image || (item.rocket && item.rocket.configuration && item.rocket.configuration.image_url) || "";
    var imageHtml = img
      ? '<img src="' + img + '" alt="' + name + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />'
      : '<i class="fas fa-rocket text-5xl text-slate-700"></i>';

    box += `<div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer">
              <div class="relative h-48 bg-slate-900/50 flex items-center justify-center overflow-hidden">
                ${imageHtml}
                <div class="absolute top-3 right-3">
                  <span class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">${status}</span>
                </div>
              </div>
              <div class="p-5">
                <div class="mb-3">
                  <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">${name}</h4>
                  <p class="text-sm text-slate-400 flex items-center gap-2"><i class="fas fa-building text-xs"></i> ${agency}</p>
                </div>
                <div class="space-y-2 mb-4">
                  <div class="flex items-center gap-2 text-sm"><i class="fas fa-calendar text-slate-500 w-4"></i> <span class="text-slate-300">${date}</span></div>
                  <div class="flex items-center gap-2 text-sm"><i class="fas fa-clock text-slate-500 w-4"></i> <span class="text-slate-300">${time}</span></div>
                  <div class="flex items-center gap-2 text-sm"><i class="fas fa-rocket text-slate-500 w-4"></i> <span class="text-slate-300">${rocket}</span></div>
                  <div class="flex items-center gap-2 text-sm"><i class="fas fa-map-marker-alt text-slate-500 w-4"></i> <span class="text-slate-300 line-clamp-1">${location}</span></div>
                </div>
                <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
                  <button class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">Details</button>
                </div>
              </div>
            </div>`;
  }

  launchesGrid.innerHTML = box;
}

// Planets Module
function toAU(km) {
  if (!km) return "N/A";
  return (km / 149597870.7).toFixed(2);
}

function getPlanets() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", PLANETS_API_URL, true);
  xhr.setRequestHeader("Authorization", "Bearer " + PLANETS_TOKEN);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      var json = JSON.parse(xhr.responseText);
      planetsList = json.bodies || [];

      displayPlanetsGrid(planetsList);
      displayPlanetsTable(planetsList);

      var defaultPlanet = null;
      for (var i = 0; i < planetsList.length; i++) {
        if (planetsList[i].englishName && planetsList[i].englishName.toLowerCase() === "earth") {
          defaultPlanet = planetsList[i];
          break;
        }
      }

      if (!defaultPlanet && planetsList.length > 0) {
        defaultPlanet = planetsList[0];
      }

      if (defaultPlanet) {
        displayPlanetDetails(defaultPlanet);
      }
    }
  };

  xhr.send();
}

function displayPlanetsGrid(planets) {
  if (!planetsGrid) return;

  planetsGrid.innerHTML = "";

  for (var i = 0; i < planets.length; i++) {
    (function (item) {
      var planetId = item.englishName.toLowerCase();
      var planetColor = planetColors[planetId] || "#3b82f6";
      var au = toAU(item.semimajorAxis);

      var card = document.createElement("div");
      card.className = "planet-card bg-slate-800/50 border border-slate-700 rounded-2xl p-4 transition-all cursor-pointer group";
      card.setAttribute("data-planet-id", planetId);
      card.style.setProperty("--planet-color", planetColor);

      card.onmouseover = function () {
        card.style.borderColor = planetColor + "80";
      };
      card.onmouseout = function () {
        card.style.borderColor = "#334155";
      };

      card.innerHTML = `<div class="relative mb-3 h-24 flex items-center justify-center">
                          <img class="w-20 h-20 object-contain group-hover:scale-110 transition-transform" 
                               src="./assets/images/${planetId}.png" 
                               alt="${item.englishName}" 
                               onerror="this.onerror=null; this.src='./assets/images/placeholder.webp';" />
                        </div>
                        <h4 class="font-semibold text-center text-sm">${item.englishName}</h4>
                        <p class="text-xs text-slate-400 text-center">${au} AU</p>`;

      card.addEventListener("click", function () {
        displayPlanetDetails(item);
      });

      planetsGrid.appendChild(card);
    })(planets[i]);
  }
}

function displayPlanetDetails(p) {
  var planetId = p.englishName.toLowerCase();

  if (planetDetailName) planetDetailName.textContent = p.englishName;
  if (planetDetailImage) {
    planetDetailImage.src = "./assets/images/" + planetId + ".png";
    planetDetailImage.alt = p.englishName;
  }
  if (planetDistance) planetDistance.textContent = (p.semimajorAxis / 1000000).toFixed(1) + "M km";
  if (planetRadius) planetRadius.textContent = p.meanRadius ? p.meanRadius.toLocaleString() + " km" : "N/A km";
  if (planetMass && p.mass) planetMass.textContent = p.mass.massValue + " × 10²⁴ kg";
  if (planetDensity) planetDensity.textContent = p.density ? p.density.toFixed(2) + " g/cm³" : "N/A g/cm³";
  if (planetOrbitalPeriod) planetOrbitalPeriod.textContent = p.sideralOrbit ? p.sideralOrbit.toFixed(1) + " days" : "N/A days";
  if (planetRotation) planetRotation.textContent = p.sideralRotation ? Math.abs(p.sideralRotation).toFixed(1) + " hours" : "N/A hours";
  if (planetMoons) planetMoons.textContent = p.moons ? p.moons.length : 0;
  if (planetGravity) planetGravity.textContent = p.gravity ? p.gravity + " m/s²" : "N/A m/s²";

  if (planetDiscoverer) planetDiscoverer.textContent = p.discoveredBy || "Known since antiquity";
  if (planetDiscoveryDate) planetDiscoveryDate.textContent = p.discoveryDate || "Ancient";
  if (planetBodyType) planetBodyType.textContent = p.bodyType || "Planet";
  if (planetVolume && p.vol) planetVolume.textContent = p.vol.volValue + " × 10¹⁰ km³";

  if (planetPerihelion) planetPerihelion.textContent = (p.perihelion / 1000000).toFixed(1) + "M km";
  if (planetAphelion) planetAphelion.textContent = (p.aphelion / 1000000).toFixed(1) + "M km";
  if (planetEccentricity) planetEccentricity.textContent = p.eccentricity || "N/A";
  if (planetInclination) planetInclination.textContent = p.inclination ? p.inclination.toFixed(2) + "°" : "0°";
  if (planetTemp) planetTemp.textContent = p.avgTemp ? (p.avgTemp - 273.15).toFixed(0) + "°C" : "N/A";
  if (planetEscape) planetEscape.textContent = p.escape ? (p.escape / 1000).toFixed(1) + " km/s" : "N/A";
}

function displayPlanetsTable(planets) {
  if (!planetComparisonTbody) return;

  var box = "";

  for (var i = 0; i < planets.length; i++) {
    var item = planets[i];
    var planetId = item.englishName.toLowerCase();
    var planetColor = planetColors[planetId] || "#3b82f6";
    var au = toAU(item.semimajorAxis);
    var diameter = item.meanRadius ? (item.meanRadius * 2).toLocaleString() : "N/A";
    var moonsCount = item.moons ? item.moons.length : 0;
    var massVal = item.mass && item.mass.massValue ? item.mass.massValue : "N/A";
    var orbitVal = item.sideralOrbit ? item.sideralOrbit.toFixed(1) + " days" : "N/A";
    var bodyTypeVal = item.bodyType || "Planet";

    box += `<tr class="hover:bg-slate-800/30 transition-colors">
              <td class="px-4 md:px-6 py-3 md:py-4 sticky left-0 bg-slate-800 z-10">
                <div class="flex items-center space-x-2 md:space-x-3">
                  <div class="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0" style="background-color: ${planetColor}"></div>
                  <span class="font-semibold text-sm md:text-base whitespace-nowrap">${item.englishName}</span>
                </div>
              </td>
              <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${au}</td>
              <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${diameter}</td>
              <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${massVal}</td>
              <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${orbitVal}</td>
              <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${moonsCount}</td>
              <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                <span class="px-2 py-1 rounded text-xs bg-blue-500/50 text-blue-200">${bodyTypeVal}</span>
              </td>
            </tr>`;
  }

  planetComparisonTbody.innerHTML = box;
}
