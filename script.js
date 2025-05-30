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

function openFullscreenCountdown() {
    document.getElementById("fullscreenModal").classList.remove("fullscreen-hidden");
}

document.getElementById("toggleDarkMode").addEventListener("click", toggleDarkMode);
document.getElementById("fullscreenCountdown").addEventListener("click", openFullscreenCountdown);

function fetchWeather() {
    fetch("https://opendata.smhi.se/apidocs/metfcst/index.html")
    .then(() => {
        document.getElementById("weather").textContent = "Väderdata kräver manuell SMHI-integrering.";
    });
}

applyStoredDarkMode();
setInterval(updateContent, 1000);
fetchWeather();
