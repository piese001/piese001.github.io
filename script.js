function getNextEventStartTime(currentEvent, events) {
    const currentIndex = events.findIndex(event => event.text === currentEvent.text);
    if (currentIndex === -1 || currentIndex + 1 >= events.length) return null; // Om nuvarande event är det sista, eller inte hittas
    return events[currentIndex + 1].start;
}

function calculateCountdown(targetTime, now) {
    if (!targetTime) return '00:00:00';
    let [targetHour, targetMinute] = targetTime.split(':').map(Number);
    let targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetHour, targetMinute);
    let diffInSeconds = Math.floor((targetDate - now) / 1000);

    let hours = Math.floor(diffInSeconds / 3600);
    diffInSeconds -= hours * 3600;
    let minutes = Math.floor(diffInSeconds / 60);
    let seconds = diffInSeconds - minutes * 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateContent() {
    const now = new Date();
    const events = getTimeEvents();
    const currentEvent = findCurrentEvent(now, events);
    const nextEventStartTime = getNextEventStartTime(currentEvent, events);
    const countdown = calculateCountdown(nextEventStartTime, now);
    const timeString = now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });

    document.getElementById('clock').textContent = `Klockan är ${timeString}`;
    document.getElementById('currentEvent').textContent = `Aktuellt pass: ${currentEvent.text}`;
    document.getElementById('nextEvent').textContent = `Nästa: ${currentEvent.next}`;
    document.getElementById('countdown').textContent = `Nedräkning till nästa: ${countdown}`;
}

setInterval(updateContent, 1000);
