const timeOffset = {
  420: "WIB",
  480: "WITA",
  540: "WIT"
};

const getUserZoneLabel = () => {
  const offset = new Date().getTimezoneOffset();
  return timeOffset[-offset] || "WIB";
};

function loadChannels() {
  fetch("channels.json")
    .then(res => res.json())
    .then(data => renderChannels(data));
}

function renderChannels(channels) {
  const container = document.getElementById("channelContainer");
  const now = new Date();

  channels.sort((a, b) => {
    const aTime = new Date(a.start);
    const bTime = new Date(b.start);
    const aLive = now >= aTime;
    const bLive = now >= bTime;
    if (aLive && !bLive) return -1;
    if (!aLive && bLive) return 1;
    return aTime - bTime;
  });

  channels.forEach(channel => {
    const start = new Date(channel.start);
    const isLive = now >= start;
    const zoneLabel = getUserZoneLabel();
    const adjusted = new Date(start.getTime() + ((new Date().getTimezoneOffset() - 480) * 60000));
    const timeText = isLive
      ? '<span class="text-red-500 font-bold animate-pulse">🔴 LIVE</span>'
      : adjusted.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit', hour12: false }) + ' ' + zoneLabel;

    const card = document.createElement("div");
    card.className = "bg-gray-800 rounded-xl overflow-hidden shadow-lg transition hover:scale-105 duration-300";

    card.innerHTML = `
      <a href="player.html?url=${encodeURIComponent(channel.url)}" target="_blank">
        <img src="${channel.poster}" alt="${channel.title}" class="w-full h-40 object-cover">
        <div class="p-4">
          <h3 class="text-lg font-semibold mb-1">${channel.title}</h3>
          <div class="text-sm text-gray-400">${timeText}</div>
        </div>
      </a>
    `;

    container.appendChild(card);
  });
}

window.addEventListener("DOMContentLoaded", loadChannels);
