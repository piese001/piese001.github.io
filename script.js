function updateCountdown(nextEventStart) {
    const now = new Date();
    const [nextHour, nextMinute] = nextEventStart.split(':').map(Number);
    const nextEventDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), nextHour, nextMinute);
    const diff = nextEventDate - now;

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    document.getElementById('countdown').textContent = `Nedräkning: ${minutes} minuter och ${seconds} sekunder till nästa händelse.`;
}

function findNextEvent(now, events) {
    // Returnerar nästa event baserat på nuvarande tid
    for (let i = 0; i < events.length; i++) {
        let [startHour, startMinute] = events[i].start.split(':').map(Number);
        let startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute);
        if (now < startDate) {
            return events[i];
        }
    }
    return events[0]; // Om ingen framtida händelse hittas, anta att nästa händelse är den första händelsen nästa dag
}

function updateContent() {
    const now = new Date();
    const events = getTimeEvents();
    const currentEvent = findCurrentEvent(now, events);
    const nextEvent = findNextEvent(now, events);
    const timeString = now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });

    document.getElementById('clock').textContent = `Klockan är ${timeString}`;
    document.getElementById('currentEvent').textContent = `Aktuellt pass: ${currentEvent.text}`;
    document.getElementById('nextEvent').textContent = `Nästa: ${nextEvent.text}`;

    updateCountdown(nextEvent.start);
}

setInterval(updateContent, 1000);
