const events = {};
let currentDate = new Date();

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  $('#monthYear').text(
    currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
  );
  const calendar = $('#calendar');
  calendar.empty();

  // Blank days
  for (let i = 0; i < firstDay; i++) {
    calendar.append('<div class="col calendar-day bg-transparent border-0"></div>');
  }

  // Days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${month}-${day}`;
    const dayOfWeek = new Date(year, month, day).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const hasEvent = events[dateKey] ? '<div class="event-dot"></div>' : '';
    calendar.append(
      `<div class="col calendar-day ${isWeekend ? 'weekend' : ''}" data-date="${dateKey}">${day}${hasEvent}</div>`
    );
  }
}

$(document).ready(function () {
  renderCalendar();

  $('#prevMonth').click(() => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  $('#nextMonth').click(() => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  $(document).on('click', '.calendar-day', function () {
    const dateKey = $(this).data('date');
    if (!dateKey) return;
    $('#selectedDate').text(`Selected Date: ${dateKey}`);
    $('#eventText').val(events[dateKey] || '');
    $('#saveEvent').data('date', dateKey);
    new bootstrap.Modal(document.getElementById('eventModal')).show();
  });

  $('#saveEvent').click(function () {
    const dateKey = $(this).data('date');
    const eventText = $('#eventText').val().trim();
    if (eventText) {
      events[dateKey] = eventText;
    } else {
      delete events[dateKey];
    }
    renderCalendar();
    bootstrap.Modal.getInstance(document.getElementById('eventModal')).hide();
  });
});
