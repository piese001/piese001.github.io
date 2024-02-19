function getTimeEvents() {
    const events = [
        { start: '08:00', end: '08:10', text: 'Samling och Närvaro', next: 'Pass 1' },
        { start: '08:15', end: '09:00', text: 'Pass 1', next: 'Fika' },
        { start: '09:00', end: '09:20', text: 'Fika', next: 'Pass 2' },
        { start: '09:20', end: '10:20', text: 'Pass 2', next: 'Rast' },
        { start: '10:20', end: '10:30', text: 'Rast', next: 'Pass 3' },
        { start: '10:30', end: '11:30', text: 'Pass 3', next: 'Lunch' },
        { start: '11:30', end: '12:20', text: 'Lunch', next: 'Pass 4' },
        { start: '12:20', end: '13:00', text: 'Pass 4', next: 'Rast' },
        { start: '13:00', end: '13:10', text: 'Rast', next: 'Pass 5' },
        { start: '13:10', end: '14:00', text: 'Pass 5', next: 'Rast/Frukt' },
        { start: '14:00', end: '14:10', text: 'Rast/Frukt', next: 'Pass 6' },
        { start: '14:10', end: '23:59', text: 'Pass 6', next: 'Skoldagen slut' },
        { start: '00:00', end: '07:59', text: 'Skoldagen startar om', next: 'Samling och Närvaro' }
    ];
    return events;
}

function findCurrentEvent(now, events) {
    for (let event of events) {
        let [startHour, startMinute] = event.start.split(':').map(Number);
        let [endHour, endMinute] = event.end.split(':').map(Number);
        let startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute);
        let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute);

        if (now >= startDate && now < endDate) {
            return event;
        }
    }
    // Returnerar ett standardvärde om ingen händelse hittas (borde inte hända)
    return { text: 'Ingen händelse', next: 'Okänd' };
}

function updateContent() {
    const now = new Date();
    const events = getTimeEvents();
    const currentEvent = findCurrentEvent(now, events);
    const timeString = now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });

    document.getElementById('clock').textContent = `Klockan är ${timeString}`;
    document.getElementById('currentEvent').textContent = `Aktuellt pass: ${currentEvent.text}`;
    document.getElementById('nextEvent').textContent = `Nästa: ${currentEvent.next}`;

    // Implementera nedräkningen här...
}

setInterval(updateContent, 1000);
