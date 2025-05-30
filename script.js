function getTimeEvents() {
    return [
        { start: '08:00', end: '08:15', text: 'Samling och Närvaro', nextStart: '08:15' },
        { start: '08:15', end: '09:00', text: 'Pass 1', nextStart: '09:00' },
        { start: '09:00', end: '09:20', text: 'Fika', nextStart: '09:20' },
        { start: '09:20', end: '10:20', text: 'Pass 2', nextStart: '10:20' },
        { start: '10:20', end: '10:30', text: 'Rast', nextStart: '10:30' },
        { start: '10:30', end: '11:30', text: 'Pass 3 + Prov i B5', nextStart: '11:30' },
        { start: '11:30', end: '12:20', text: 'Lunch', nextStart: '12:20' },
        { start: '12:20', end: '13:00', text: 'Pass 4', nextStart: '13:00' },
        { start: '13:00', end: '13:10', text: 'Rast', nextStart: '13:10' },
        { start: '13:10', end: '14:00', text: 'Pass 5', nextStart: '14:00' },
        { start: '14:00', end: '14:10', text: 'Rast/Frukt', nextStart: '14:10' },
        { start: '14:10', end: '14:50', text: 'Pass 6', nextStart: '14:50' },
        { start: '14:50', end: '23:59', text: 'Sportlov', nextStart: '07:30' },
        { start: '07:30', end: '08:00', text: 'Fortsätt sova', nextStart: '08:00' }
    ];
}

let lastEventText = "";

function getCurrentAndNextEvent(now, events) {
    const currentTime = now.getHours() * 60 + now.getMinutes();
    for (const event of events) {
        const [startHour, startMinute] = event.start.split(":").map(Number);
        const [endHour, endMinute] = event.end.split(":").map(Number);
        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;
        if (currentTime >= startTime && currentTime < endTime) {
            return event;
        }
    }
    return null;
}

function updateBackgroundColor(currentEventText) {
    const specialEvents = ['Fika', 'Rast', 'Lunch', 'Rast/Frukt', 'Skoldagen slut', 'Förberedelse för skoldagen'];
    document.body.style.backgroundColor = specialEvents.includes(currentEventText) ? '#ffcccc' : '';
}

function updateContent() {
    const now = new Date();
    const events = getTimeEvents();
    const currentEvent = getCurrentAndNextEvent(now, events);
    const timeString = now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
    document.getElementById("clock").textContent = `Klockan är ${timeString}`;

    if (currentEvent) {
        if (lastEventText !== currentEvent.text) {
            document.getElementById("bell").play();
            lastEventText = currentEvent.text;
        }

        document.getElementById("currentEvent").textContent = `Aktuellt pass: ${currentEvent.text}`;
        const nextEventIndex = events.findIndex(e => e.start === currentEvent.nextStart);
        const nextEvent = events[nextEventIndex];
        const overNextEvent = events[(nextEventIndex + 1) % events.length];

        const nextDate = new Date(now.toDateString() + ' ' + nextEvent.start);
        const diffNext = nextDate - now;
        const minutes = Math.floor(diffNext / 60000);
        const seconds = Math.floor((diffNext % 60000) / 1000);
        document.getElementById("countdown").textContent = `${nextEvent.text} om ${minutes} minuter och ${seconds} sekunder.`;
        document.getElementById("fsEvent").textContent = nextEvent.text;
        document.getElementById("fsCountdown").textContent = `${minutes} min ${seconds} sek`;

        const overNextDate = new Date(now.toDateString() + ' ' + overNextEvent.start);
        if (overNextDate <= now) overNextDate.setDate(overNextDate.getDate() + 1);
        const overMinutes = Math.floor((overNextDate - now) / 60000);
        document.getElementById("overNextEvent").textContent = `${overNextEvent.text} om ${overMinutes} minuter.`;

        updateBackgroundColor(currentEvent.text);
    } else {
        document.getElementById("currentEvent").textContent = 'Inget pågående pass.';
        document.getElementById("countdown").textContent = '';
        document.getElementById("overNextEvent").textContent = '';
        updateBackgroundColor('');
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function applyStoredDarkMode() {
    const stored = localStorage.getItem('darkMode');
    if (stored === 'true') document.body.classList.add('dark-mode');
}

function openFullscreenCountdown(event) {
    event?.stopPropagation();
    document.getElementById("fullscreenModal").classList.remove("fullscreen-hidden");
}

function closeFullscreenCountdown(event) {
    event?.stopPropagation();
    document.getElementById("fullscreenModal").classList.add("fullscreen-hidden");
}

document.getElementById("toggleDarkMode").addEventListener("click", toggleDarkMode);
document.getElementById("fullscreenCountdown").addEventListener("click", openFullscreenCountdown);
document.getElementById("fullscreenModal").addEventListener("click", function(event) {
    if (event.target === document.getElementById("fullscreenModal")) {
        closeFullscreenCountdown();
    }
});
document.getElementById("closeFullscreen").addEventListener("click", function(event) {
    closeFullscreenCountdown(event);
});
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeFullscreenCountdown();
    }
});

function fetchWeather() {
    const lat = 58.705;
    const lon = 15.774;
    const url = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${lon}/lat/${lat}/data.json`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const now = new Date();
            const timeSeries = data.timeSeries;
            const forecast = timeSeries.find(entry => new Date(entry.validTime) > now);

            if (!forecast) {
                document.getElementById("weather").textContent = "Väderdata saknas.";
                return;
            }

            const temperature = forecast.parameters.find(p => p.name === "t").values[0];
            const weatherSymbol = forecast.parameters.find(p => p.name === "Wsymb2").values[0];

            const symbolMap = {
                1: "☀️ Klart",
                2: "🌤️ Lätt molnighet",
                3: "🌥️ Molnigt",
                4: "⛅ Halvklart",
                5: "☁️ Molnigt",
                6: "🌫️ Mulet",
                7: "🌁 Dimma",
                8: "🌦️ Lätt regn",
                9: "🌧️ Regn",
                10: "🌧️💧 Kraftigt regn",
                11: "🌦️ Skurar",
                12: "⛈️ Åska",
                13: "🌨️ Snöblandat regn",
                14: "❄️ Snö",
                15: "❄️❄️ Kraftigt snöfall"
            };

            const description = symbolMap[weatherSymbol] || "🌈 Okänt väder";

            document.getElementById("weather").textContent = `Väder i Finspång: ${temperature}°C, ${description}`;
        })
        .catch(() => {
            document.getElementById("weather").textContent = "Kunde inte hämta väder.";
        });
}

applyStoredDarkMode();
setInterval(updateContent, 1000);
fetchWeather();
