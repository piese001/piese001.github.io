function getTimeEvents() {
    return [
        { start: '08:00', end: '08:15', text: 'Samling och Närvaro', nextStart: '08:15' },
        { start: '08:15', end: '09:00', text: 'Pass 1', nextStart: '09:00' },
        { start: '09:00', end: '09:20', text: 'Fika', nextStart: '09:20' },
        { start: '09:20', end: '10:20', text: 'Pass 2', nextStart: '10:20' },
        { start: '10:20', end: '10:30', text: 'Rast', nextStart: '10:30' },
        { start: '10:30', end: '11:30', text: 'Pass 3', nextStart: '11:30' },
        { start: '11:30', end: '12:20', text: 'Lunch', nextStart: '12:20' },
        { start: '12:20', end: '13:00', text: 'Pass 4', nextStart: '13:00' },
        { start: '13:00', end: '13:10', text: 'Rast', nextStart: '13:10' },
        { start: '13:10', end: '14:00', text: 'Pass 5', nextStart: '14:00' },
        { start: '14:00', end: '14:10', text: 'Rast/Frukt', nextStart: '14:10' },
        { start: '14:10', end: '14:50', text: 'Pass 6', nextStart: '08:00' },
        { start: '00:00', end: '07:59', text: 'Förberedelse för skoldagen', nextStart: '08:00' }
    ];
}

function getCurrentAndNextEvent(now, events) {
    const currentTime = now.getHours() * 60 + now.getMinutes();
    for (const event of events) {
        const [startHour, startMinute] = event.start.split(':').map(Number);
        const [endHour, endMinute] = event.end.split(':').map(Number);
        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;

        if (currentTime >= startTime && currentTime < endTime) {
            return event;
        }
    }
    return null;
}

function updateContent() {
    const now = new Date();
    const events = getTimeEvents();
    const currentEvent = getCurrentAndNextEvent(now, events);
    const timeString = now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });

    document.getElementById('clock').textContent = `Klockan är ${timeString}`;

    if (currentEvent) {
        document.getElementById('currentEvent').textContent = `Aktuellt pass: ${currentEvent.text}`;
        const nextEventIndex = events.findIndex(event => event.start === currentEvent.nextStart);
        const nextEvent = events[nextEventIndex];
        //document.getElementById('nextEvent').textContent = `Nästa: ${nextEvent.text}`;

        // Nedräkning till nästa pass
        const [nextHour, nextMinute] = nextEvent.start.split(':').map(Number);
        const nextEventDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), nextHour, nextMinute);
        const diff = nextEventDate - now;
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        document.getElementById('countdown').textContent = `${nextEvent.text} om ${minutes} minuter och ${seconds} sekunder.`;
    } else {
        document.getElementById('currentEvent').textContent = 'Inget pågående pass.';
        document.getElementById('nextEvent').textContent = 'Väntar på nästa pass...';
        document.getElementById('countdown').textContent = '';
    }
}

setInterval(updateContent, 1000);
