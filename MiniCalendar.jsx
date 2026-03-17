function MiniCalendar({ history }) {
  const today = new Date();

  return (
    <div className="panel">
      <h3>📅 Calendar</h3>

      <div className="calendar">
        {Array.from({ length: 30 }).map((_, i) => {
          const day = i + 1;

          const isImportant = history.some(
            (h) => new Date(h.date).getDate() === day
          );

          return (
            <div
              key={i}
              className={`day ${isImportant ? "important" : ""}`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MiniCalendar;