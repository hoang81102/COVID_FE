import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route} from "react-router-dom";
import LoginPage from "./page/LoginPage";
function App() {
  return (
   <>
        <Routes>
         <Route path="/" element={<LoginPage />} />
          
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

export default App
