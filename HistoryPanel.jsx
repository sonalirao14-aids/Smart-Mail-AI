function HistoryPanel({ history }) {
  return (
    <div className="panel">
      <h3>🕘 History</h3>

      {history.map((item, index) => (
        <div key={index} className="history-item">
          <p>{item.intent}</p>
          <small>{item.date}</small>
        </div>
      ))}
    </div>
  );
}

export default HistoryPanel;