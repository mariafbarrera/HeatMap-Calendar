import logo from './logo.svg';
import './App.css';
import HeatmapCalendar from "./HeatmapCalendar";

function App() {
  return (
      <div className="app-container">
        <h1>YouTube Watch History Calendar 2024</h1>
        <HeatmapCalendar year={2024}/>
      </div>
  );
}

export default App;
