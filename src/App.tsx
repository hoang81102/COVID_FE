import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";

import SideBar from "./page/SideBar";
import Confirmed from "./components/Confirmed";
import Active from "./components/Active";
import Recovered from "./components/Recovered";
import Deaths from "./components/Deaths";
import DailyIncrease from "./components/DailyIncrease";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SideBar />} />
        <Route path="/stats/confirmed" element={<Confirmed />} />
        <Route path="/stats/active" element={<Active />} />
        <Route path="/stats/recovered" element={<Recovered />} />
        <Route path="/stats/deaths" element={<Deaths />} />
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
