function ResultCard({ result }) {
  if (!result) return null;

  const getColor = () => {
    switch (result.intent) {
      case "Urgent":
        return "red";
      case "Meeting":
        return "blue";
      case "Task":
        return "orange";
      default:
        return "gray";
    }
  };

  return (
    <div className="card">
      <span className="badge" style={{ background: getColor() }}>
        {result.intent}
      </span>

      <h3>{result.action}</h3>

      <div className="reply-box">
        {result.reply}
      </div>
    </div>
  );
}

export default ResultCard;