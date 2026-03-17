import HistoryPanel from "./HistoryPanel";
import MiniCalendar from "./MiniCalendar";

function Sidebar({ history }) {
  return (
    <div className="sidebar">
      <MiniCalendar history={history} />
      <HistoryPanel history={history} />
    </div>
  );
}

export default Sidebar;