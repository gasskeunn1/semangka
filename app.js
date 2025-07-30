const player = new shaka.Player(document.getElementById('video'));
const video = document.getElementById('video');

video.controls = false;
let hasPlayed = false;
video.addEventListener('play', () => {
  if (!hasPlayed) {
    video.controls = true;
    hasPlayed = true;
  }
});

fetch('channels.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('channels');
    data.forEach(channel => {
      const card = document.createElement('div');
      card.className = 'bg-gray-800 rounded-xl p-4 hover:scale-105 transition cursor-pointer';
      const now = new Date();
      const isLive = now >= parseWIBTime(channel.time);
      const timeDisplay = isLive
        ? '<span class="text-red-500 animate-pulse font-bold">LIVE</span>'
        : formatToLocalTime(channel.time);
      card.innerHTML = `
        <img src="${channel.logo}" alt="${channel.title}" class="w-full h-32 object-cover rounded mb-2">
        <h2 class="text-lg font-semibold">${channel.title}</h2>
        <p class="text-sm text-gray-400">${timeDisplay}</p>
      `;
      card.addEventListener('click', () => {
        player.load(channel.url).then(() => video.play());
      });
      container.appendChild(card);
    });
  });

function parseWIBTime(wibString) {
  const [datePart, timePart] = wibString.replace(" WIB", "").split(" ");
  const [day, month, year] = datePart.split("-");
  const [hour, minute] = timePart.split(":");
  return new Date(Date.UTC(year, month - 1, day, hour - 7, minute)); // WIB = UTC+7
}

function formatToLocalTime(wibString) {
  const utcDate = parseWIBTime(wibString);
  const localDate = new Date(utcDate.getTime());
  const offsetHours = localDate.getTimezoneOffset() / -60;
  let label = "";
  if (offsetHours === 7) {
    label = "WIB";
  } else if (offsetHours === 8) {
    label = "WITA";
  } else if (offsetHours === 9) {
    label = "WIT";
  } else {
    label = `GMT${offsetHours >= 0 ? "+" : ""}${offsetHours}`;
  }
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };
  return `${localDate.toLocaleString(undefined, options)} ${label}`;
}