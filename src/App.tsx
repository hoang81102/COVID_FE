import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";


import Confirmed from "./components/Confirmed";
import Active from "./components/Active";
import Recovered from "./components/Recovered";
import Deaths from "./components/Deaths";
import DailyIncrease from "./components/DailyIncrease";
import DeathsTree from "./components/DeathsTree";
import ConfirmedTree from "./components/ConfirmedTree";
import RecoveredTree from "./components/RecoveredTree";
import ActiveTree from "./components/ActiveTree";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Confirmed />} />
        <Route path="/tree" element={<ConfirmedTree />} />
        <Route path="/stats/active" element={<Active />} />
        <Route path="/stats/activetree" element={<ActiveTree />} />
        <Route path="/stats/recovered" element={<Recovered />} />
        <Route path="/stats/recoveredtree" element={<RecoveredTree />} />
        <Route path="/stats/deaths" element={<Deaths />} />
        <Route path="/stats/deathstree" element={<DeathsTree />} />
        <Route path="/stats/daily-increase" element={<DailyIncrease />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
}

export default App;
