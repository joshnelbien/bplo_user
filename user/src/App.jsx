import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./homePage/homePage";
import LoginPage from "./loginPage/loginPage";
import NewApplicationPage from "./NewApplicationPage/newApplicationPage";
import RegisterPage from "./registerPage/registerPage";
import AppTracker from "./appTracker/appTracker";
import Renew from "./Renew/Renew";
import Main from "./main/mainPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/loginPage" element={<LoginPage />} />
        <Route path="/homePage/me/:id" element={<HomePage />} />
        <Route
          path="/newApplicationPage/me/:id"
          element={<NewApplicationPage />}
        />
        <Route path="/registerPage" element={<RegisterPage />} />
        <Route path="/appTracker/me/:id" element={<AppTracker />} />
        <Route path="/renew/me" element={<Renew />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
