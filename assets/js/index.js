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

var apiKey = "bU7WaOFtMVnWeJGvbySkFHQt5WestD49c69xOgQa";

function getTodayDate() {
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var day = today.getDate();

  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }

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
  if (loading) {
    loading.classList.remove("hidden");
  }

  var url = "https://api.nasa.gov/planetary/apod?api_key=" + apiKey + "&date=" + date;

  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);

  xhr.onload = function () {
    if (loading) {
      loading.classList.add("hidden");
    }

    if (xhr.status >= 200 && xhr.status < 300) {
      var data = JSON.parse(xhr.responseText);
      showApod(data);
    } else {
      alert("Could not load Astronomy Picture of the Day for the selected date.");
    }
  };

  xhr.onerror = function () {
    if (loading) {
      loading.classList.add("hidden");
    }
    alert("Could not load Astronomy Picture of the Day for the selected date.");
  };

  xhr.send();
}

function showApod(data) {
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

var LAUNCHES_API_URL = "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=10";
var launchesList = [];

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
  if (days > 0) {
    return days;
  }
  return 0;
}

function getLaunches() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", LAUNCHES_API_URL, true);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      var json = JSON.parse(xhr.responseText);
      if (json.results) {
        launchesList = json.results;
      } else {
        launchesList = [];
      }

      if (launchesList.length > 0) {
        updateFeaturedLaunch(launchesList[0]);

        var remaining = [];
        for (var i = 1; i < launchesList.length; i++) {
          remaining.push(launchesList[i]);
        }
        renderLaunchesGrid(remaining);
      }

      var countEl = document.getElementById("launches-count");
      var countMobileEl = document.getElementById("launches-count-mobile");
      if (countEl) countEl.textContent = launchesList.length + " Launches";
      if (countMobileEl) countMobileEl.textContent = launchesList.length;
    }
  };

  xhr.send();
}

function updateFeaturedLaunch(item) {
  var featContainer = document.getElementById("featured-launch");
  if (!featContainer) return;

  var name = item.name || "Upcoming Mission";
  var agency = "Unknown Agency";
  if (item.launch_service_provider && item.launch_service_provider.name) {
    agency = item.launch_service_provider.name;
  }

  var rocket = "Rocket";
  if (item.rocket && item.rocket.configuration && item.rocket.configuration.name) {
    rocket = item.rocket.configuration.name;
  }

  var location = "Unknown Location";
  if (item.pad && item.pad.location && item.pad.location.name) {
    location = item.pad.location.name;
  }

  var country = "N/A";
  if (item.pad && item.pad.location && item.pad.location.country_code) {
    country = item.pad.location.country_code;
  }

  var date = formatLaunchDate(item.net);
  var time = formatLaunchTime(item.net);
  var days = getDaysUntil(item.net);

  var status = "Go";
  if (item.status && item.status.abbrev) {
    status = item.status.abbrev;
  }

  var desc = "No mission description available for this launch.";
  if (item.mission && item.mission.description) {
    desc = item.mission.description;
  }

  var img = "";
  if (item.image) {
    img = item.image;
  } else if (item.rocket && item.rocket.configuration && item.rocket.configuration.image_url) {
    img = item.rocket.configuration.image_url;
  }

  var imageHtml = '<i class="fas fa-rocket text-9xl text-slate-700/50"></i>';
  if (img) {
    imageHtml = '<img src="' + img + '" alt="' + name + '" class="w-full h-full object-cover" />';
  }

  var html = "";
  html +=
    '<div class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all">';
  html += '  <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">';
  html += '    <div class="flex flex-col justify-between">';
  html += "      <div>";
  html += '        <div class="flex items-center gap-3 mb-4">';
  html += '          <span class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2">';
  html += '            <i class="fas fa-star"></i> Featured Launch';
  html += "          </span>";
  html += '          <span class="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">';
  html += "            " + status;
  html += "          </span>";
  html += "        </div>";
  html += '        <h3 class="text-3xl font-bold mb-3 leading-tight">' + name + "</h3>";
  html += '        <div class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400">';
  html += '          <div class="flex items-center gap-2"><i class="fas fa-building"></i> <span>' + agency + "</span></div>";
  html += '          <div class="flex items-center gap-2"><i class="fas fa-rocket"></i> <span>' + rocket + "</span></div>";
  html += "        </div>";
  html +=
    '        <div class="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6">';
  html += '          <i class="fas fa-clock text-2xl text-blue-400"></i>';
  html += "          <div>";
  html += '            <p class="text-2xl font-bold text-blue-400">' + days + "</p>";
  html += '            <p class="text-xs text-slate-400">Days Until Launch</p>';
  html += "          </div>";
  html += "        </div>";
  html += '        <div class="grid xl:grid-cols-2 gap-4 mb-6">';
  html += '          <div class="bg-slate-900/50 rounded-xl p-4">';
  html += '            <p class="text-xs text-slate-400 mb-1 flex items-center gap-2"><i class="fas fa-calendar"></i> Launch Date</p>';
  html += '            <p class="font-semibold">' + date + "</p>";
  html += "          </div>";
  html += '          <div class="bg-slate-900/50 rounded-xl p-4">';
  html += '            <p class="text-xs text-slate-400 mb-1 flex items-center gap-2"><i class="fas fa-clock"></i> Launch Time</p>';
  html += '            <p class="font-semibold">' + time + "</p>";
  html += "          </div>";
  html += '          <div class="bg-slate-900/50 rounded-xl p-4">';
  html += '            <p class="text-xs text-slate-400 mb-1 flex items-center gap-2"><i class="fas fa-map-marker-alt"></i> Location</p>';
  html += '            <p class="font-semibold text-sm line-clamp-1">' + location + "</p>";
  html += "          </div>";
  html += '          <div class="bg-slate-900/50 rounded-xl p-4">';
  html += '            <p class="text-xs text-slate-400 mb-1 flex items-center gap-2"><i class="fas fa-globe"></i> Country</p>';
  html += '            <p class="font-semibold">' + country + "</p>";
  html += "          </div>";
  html += "        </div>";
  html += '        <p class="text-slate-300 leading-relaxed mb-6 line-clamp-3">' + desc + "</p>";
  html += "      </div>";
  html += '      <div class="flex flex-col md:flex-row gap-3">';
  html +=
    '        <button class="flex-1 px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2">';
  html += '          <i class="fas fa-info-circle"></i> View Full Details';
  html += "        </button>";
  html += "      </div>";
  html += "    </div>";
  html += '    <div class="relative">';
  html += '      <div class="relative h-full min-h-[350px] rounded-2xl overflow-hidden bg-slate-900/50 flex items-center justify-center">';
  html += "        " + imageHtml;
  html += "      </div>";
  html += "    </div>";
  html += "  </div>";
  html += "</div>";

  featContainer.innerHTML = html;
}

function renderLaunchesGrid(items) {
  var grid = document.getElementById("launches-grid");
  if (!grid) return;

  grid.innerHTML = "";

  for (var i = 0; i < items.length; i++) {
    var item = items[i];

    var name = item.name || "Upcoming Launch";
    var agency = "Unknown Agency";
    if (item.launch_service_provider && item.launch_service_provider.name) {
      agency = item.launch_service_provider.name;
    }

    var rocket = "Rocket";
    if (item.rocket && item.rocket.configuration && item.rocket.configuration.name) {
      rocket = item.rocket.configuration.name;
    }

    var location = "Unknown Location";
    if (item.pad && item.pad.name) {
      location = item.pad.name;
    }

    var date = formatLaunchDate(item.net);
    var time = formatLaunchTime(item.net);

    var status = "TBD";
    if (item.status && item.status.abbrev) {
      status = item.status.abbrev;
    }

    var img = "";
    if (item.image) {
      img = item.image;
    } else if (item.rocket && item.rocket.configuration && item.rocket.configuration.image_url) {
      img = item.rocket.configuration.image_url;
    }

    var imageHtml = '<i class="fas fa-rocket text-5xl text-slate-700"></i>';
    if (img) {
      imageHtml =
        '<img src="' + img + '" alt="' + name + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />';
    }

    var card = document.createElement("div");
    card.className =
      "bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer";

    var html = "";
    html += '<div class="relative h-48 bg-slate-900/50 flex items-center justify-center overflow-hidden">';
    html += "  " + imageHtml;
    html += '  <div class="absolute top-3 right-3">';
    html += '    <span class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">';
    html += "      " + status;
    html += "    </span>";
    html += "  </div>";
    html += "</div>";
    html += '<div class="p-5">';
    html += '  <div class="mb-3">';
    html += '    <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">' + name + "</h4>";
    html += '    <p class="text-sm text-slate-400 flex items-center gap-2"><i class="fas fa-building text-xs"></i> ' + agency + "</p>";
    html += "  </div>";
    html += '  <div class="space-y-2 mb-4">';
    html +=
      '    <div class="flex items-center gap-2 text-sm"><i class="fas fa-calendar text-slate-500 w-4"></i> <span class="text-slate-300">' +
      date +
      "</span></div>";
    html +=
      '    <div class="flex items-center gap-2 text-sm"><i class="fas fa-clock text-slate-500 w-4"></i> <span class="text-slate-300">' +
      time +
      "</span></div>";
    html +=
      '    <div class="flex items-center gap-2 text-sm"><i class="fas fa-rocket text-slate-500 w-4"></i> <span class="text-slate-300">' +
      rocket +
      "</span></div>";
    html +=
      '    <div class="flex items-center gap-2 text-sm"><i class="fas fa-map-marker-alt text-slate-500 w-4"></i> <span class="text-slate-300 line-clamp-1">' +
      location +
      "</span></div>";
    html += "  </div>";
    html += '  <div class="flex items-center gap-2 pt-4 border-t border-slate-700">';
    html +=
      '    <button class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">Details</button>';
    html += "  </div>";
    html += "</div>";

    card.innerHTML = html;
    grid.appendChild(card);
  }
}

var navLinks = document.querySelectorAll(".nav-link");
var appSections = document.querySelectorAll(".app-section");

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

for (var k = 0; k < navLinks.length; k++) {
  (function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var sectionId = link.getAttribute("data-section");
      if (sectionId) {
        switchSection(sectionId);
      }
    });
  })(navLinks[k]);
}

var PLANETS_API_URL = "https://solar-system-opendata-proxy.vercel.app/api/planets";
var PLANETS_TOKEN = "bU7WaOFtMVnWeJGvbySkFHQt5WestD49c69xOg";

var list = [];

var colors = {
  mercury: "#eab308",
  venus: "#f97316",
  earth: "#3b82f6",
  mars: "#ef4444",
  jupiter: "#fb923c",
  saturn: "#facc15",
  uranus: "#06b6d4",
  neptune: "#2563eb",
};

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
      if (json.bodies) {
        list = json.bodies;
      } else {
        list = [];
      }

      renderGrid(list);
      renderTable(list);

      var def = null;
      for (var i = 0; i < list.length; i++) {
        if (list[i].englishName && list[i].englishName.toLowerCase() === "earth") {
          def = list[i];
          break;
        }
      }

      if (!def && list.length > 0) {
        def = list[0];
      }

      if (def) {
        showDetails(def);
      }
    }
  };

  xhr.send();
}

function renderGrid(planets) {
  var grid = document.getElementById("planets-grid");
  if (!grid) return;

  grid.innerHTML = "";

  for (var i = 0; i < planets.length; i++) {
    (function (item) {
      var id = item.englishName.toLowerCase();
      var c = colors[id] || "#3b82f6";
      var au = toAU(item.semimajorAxis);

      var card = document.createElement("div");
      card.className = "planet-card bg-slate-800/50 border border-slate-700 rounded-2xl p-4 transition-all cursor-pointer group";
      card.setAttribute("data-planet-id", id);
      card.style.setProperty("--planet-color", c);

      card.onmouseover = function () {
        card.style.borderColor = c + "80";
      };
      card.onmouseout = function () {
        card.style.borderColor = "#334155";
      };

      var html = "";
      html += '<div class="relative mb-3 h-24 flex items-center justify-center">';
      html +=
        '  <img class="w-20 h-20 object-contain group-hover:scale-110 transition-transform" src="./assets/images/' +
        id +
        '.png" alt="' +
        item.englishName +
        '" onerror="this.onerror=null; this.src=\'./assets/images/placeholder.webp\';" />';
      html += "</div>";
      html += '<h4 class="font-semibold text-center text-sm">' + item.englishName + "</h4>";
      html += '<p class="text-xs text-slate-400 text-center">' + au + " AU</p>";

      card.innerHTML = html;

      card.addEventListener("click", function () {
        showDetails(item);
      });

      grid.appendChild(card);
    })(planets[i]);
  }
}

function showDetails(p) {
  var id = p.englishName.toLowerCase();

  var nameEl = document.getElementById("planet-detail-name");
  var imgEl = document.getElementById("planet-detail-image");
  var distEl = document.getElementById("planet-distance");
  var radEl = document.getElementById("planet-radius");
  var massEl = document.getElementById("planet-mass");
  var denEl = document.getElementById("planet-density");
  var orbEl = document.getElementById("planet-orbital-period");
  var rotEl = document.getElementById("planet-rotation");
  var moonEl = document.getElementById("planet-moons");
  var gravEl = document.getElementById("planet-gravity");

  if (nameEl) nameEl.textContent = p.englishName;
  if (imgEl) {
    imgEl.src = "./assets/images/" + id + ".png";
    imgEl.alt = p.englishName;
  }
  if (distEl) distEl.textContent = (p.semimajorAxis / 1000000).toFixed(1) + "M km";
  if (radEl) {
    if (p.meanRadius) {
      radEl.textContent = p.meanRadius.toLocaleString() + " km";
    } else {
      radEl.textContent = "N/A km";
    }
  }
  if (massEl && p.mass) {
    massEl.textContent = p.mass.massValue + " × 10²⁴ kg";
  }
  if (denEl) {
    if (p.density) {
      denEl.textContent = p.density.toFixed(2) + " g/cm³";
    } else {
      denEl.textContent = "N/A g/cm³";
    }
  }
  if (orbEl) {
    if (p.sideralOrbit) {
      orbEl.textContent = p.sideralOrbit.toFixed(1) + " days";
    } else {
      orbEl.textContent = "N/A days";
    }
  }
  if (rotEl) {
    if (p.sideralRotation) {
      rotEl.textContent = Math.abs(p.sideralRotation).toFixed(1) + " hours";
    } else {
      rotEl.textContent = "N/A hours";
    }
  }
  if (moonEl) {
    if (p.moons) {
      moonEl.textContent = p.moons.length;
    } else {
      moonEl.textContent = 0;
    }
  }
  if (gravEl) {
    if (p.gravity) {
      gravEl.textContent = p.gravity + " m/s²";
    } else {
      gravEl.textContent = "N/A m/s²";
    }
  }

  var discEl = document.getElementById("planet-discoverer");
  var dateEl = document.getElementById("planet-discovery-date");
  var typeEl = document.getElementById("planet-body-type");
  var volEl = document.getElementById("planet-volume");

  if (discEl) discEl.textContent = p.discoveredBy || "Known since antiquity";
  if (dateEl) dateEl.textContent = p.discoveryDate || "Ancient";
  if (typeEl) typeEl.textContent = p.bodyType || "Planet";
  if (volEl && p.vol) volEl.textContent = p.vol.volValue + " × 10¹⁰ km³";

  var periEl = document.getElementById("planet-perihelion");
  var aphEl = document.getElementById("planet-aphelion");
  var eccEl = document.getElementById("planet-eccentricity");
  var incEl = document.getElementById("planet-inclination");
  var tempEl = document.getElementById("planet-temp");
  var escEl = document.getElementById("planet-escape");

  if (periEl) periEl.textContent = (p.perihelion / 1000000).toFixed(1) + "M km";
  if (aphEl) aphEl.textContent = (p.aphelion / 1000000).toFixed(1) + "M km";
  if (eccEl) eccEl.textContent = p.eccentricity || "N/A";
  if (incEl) {
    if (p.inclination) {
      incEl.textContent = p.inclination.toFixed(2) + "°";
    } else {
      incEl.textContent = "0°";
    }
  }
  if (tempEl) {
    if (p.avgTemp) {
      tempEl.textContent = (p.avgTemp - 273.15).toFixed(0) + "°C";
    } else {
      tempEl.textContent = "N/A";
    }
  }
  if (escEl) {
    if (p.escape) {
      escEl.textContent = (p.escape / 1000).toFixed(1) + " km/s";
    } else {
      escEl.textContent = "N/A";
    }
  }
}

function renderTable(planets) {
  var tbody = document.getElementById("planet-comparison-tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  for (var i = 0; i < planets.length; i++) {
    var item = planets[i];

    var id = item.englishName.toLowerCase();
    var c = colors[id] || "#3b82f6";
    var au = toAU(item.semimajorAxis);

    var d = "N/A";
    if (item.meanRadius) {
      d = (item.meanRadius * 2).toLocaleString();
    }

    var m = 0;
    if (item.moons) {
      m = item.moons.length;
    }

    var massVal = "N/A";
    if (item.mass && item.mass.massValue) {
      massVal = item.mass.massValue;
    }

    var orbitVal = "N/A";
    if (item.sideralOrbit) {
      orbitVal = item.sideralOrbit.toFixed(1) + " days";
    }

    var bodyTypeVal = item.bodyType || "Planet";

    var tr = document.createElement("tr");
    tr.className = "hover:bg-slate-800/30 transition-colors";

    var html = "";
    html += '<td class="px-4 md:px-6 py-3 md:py-4 sticky left-0 bg-slate-800 z-10">';
    html += '  <div class="flex items-center space-x-2 md:space-x-3">';
    html += '    <div class="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0" style="background-color: ' + c + '"></div>';
    html += '    <span class="font-semibold text-sm md:text-base whitespace-nowrap">' + item.englishName + "</span>";
    html += "  </div>";
    html += "</td>";
    html += '<td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">' + au + "</td>";
    html += '<td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">' + d + "</td>";
    html += '<td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">' + massVal + "</td>";
    html += '<td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">' + orbitVal + "</td>";
    html += '<td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">' + m + "</td>";
    html += '<td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">';
    html += '  <span class="px-2 py-1 rounded text-xs bg-blue-500/50 text-blue-200">' + bodyTypeVal + "</span>";
    html += "</td>";

    tr.innerHTML = html;
    tbody.appendChild(tr);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var today = getTodayDate();
  if (dateInput) {
    dateInput.max = today;
    var date = dateInput.value || today;
    getApod(date);
  } else {
    getApod(today);
  }

  getLaunches();
  getPlanets();
});
