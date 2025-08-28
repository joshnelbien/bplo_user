import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./homePage/homePage";
import LoginPage from "./loginPage/loginPage";
import NewApplicationPage from "./NewApplicationPage/newApplicationPage";
import RegisterPage from "./registerPage/registerPage";
import AppTracker from "./appTracker/appTracker";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/homePage/:id" element={<HomePage />} />
        <Route
          path="/newApplicationPage/:id"
          element={<NewApplicationPage />}
        />
        <Route path="/registerPage" element={<RegisterPage />} />
        <Route path="/appTracker/:id" element={<AppTracker />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
