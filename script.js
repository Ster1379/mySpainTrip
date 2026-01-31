const eventDisplay = document.getElementById('event-textarea');
const dateHeader = document.getElementById('selected-date-display');
let eventData = {};

// 1. Fetch the JSON data
fetch('events.json')
    .then(response => response.json())
    .then(data => {
        eventData = data;
        // February is index 1, March is index 2
        renderCalendar(2026, 1); 
        renderCalendar(2026, 2); 
    })
    .catch(err => console.error("Error loading events:", err));

function renderCalendar(year, month) {
    const container = document.getElementById('calendar-container');
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, month));
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let tableHtml = `
        <div class="card mb-4 shadow-sm">
            <div class="card-header bg-dark text-white text-center"><h5>${monthName} ${year}</h5></div>
            <table class="table table-bordered mb-0">
                <thead>
                    <tr class="text-center bg-light">
                        <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th>
                    </tr>
                </thead>
                <tbody><tr>`;

    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
        tableHtml += `<td class="bg-light-gray"></td>`;
    }

    // Fill days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasEvent = eventData[dateString] ? 'fw-bold text-primary' : '';
        
        if ((firstDay + day - 1) % 7 === 0 && day !== 1) tableHtml += '</tr><tr>';
        
        tableHtml += `
            <td class="calendar-day ${hasEvent} p-2" onclick="showEvent('${dateString}', this)" style="cursor: pointer;">
                <div>${day}</div>
                ${eventData[dateString] ? '<small>•</small>' : ''}
            </td>`;
    }

    tableHtml += '</tr></tbody></table></div>';
    container.innerHTML += tableHtml;
}


function showEvent(dateStr, element) {
    // UI Feedback: Remove 'active' class from all days and add to the clicked one
    document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('active'));
    element.classList.add('active');

    // Display Logic
    dateHeader.innerText = dateStr;
    eventDisplay.innerHTML = eventData[dateStr] || "No events found for this day.";

    // --- NEW: Scroll to the event box on mobile ---
    // We target the closest card or the specific sticky container
    const eventBox = document.querySelector('.sticky-top');
    
    // Check if the screen width is mobile-sized (usually < 768px for Bootstrap)
    if (window.innerWidth < 768) {
        eventBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}