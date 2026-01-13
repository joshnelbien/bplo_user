import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./homePage/homePage";
import LoginPage from "./loginPage/loginPage";
import NewApplicationPage from "./NewApplicationPage/newApplicationPage";
import RegisterPage from "./registerPage/registerPage";
import AppTracker from "./appTracker/appTracker";
import Renew from "./Renew/Renew";
import Main from "./main/mainPage";
import NewApplicationRegisterPage from "./newappRegistration.jsx/newappRegistration";
import RenewalFormStepper from "./Renew/RenewalFormStepper";
import RenewApplicationPage from "./RenewApplicationPage/renewApplication";
import ClientFeedbackForm from "./feedback/feedback";
import UniversalFeedbackForm from "./UniversalFeedback/FeedbackForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/loginPage" element={<LoginPage />} />
        <Route path="/homePage/:id" element={<HomePage />} />
        <Route path="/homePage/:id/:bin" element={<HomePage />} />
        <Route
          path="/newApplicationPage/:id"
          element={<NewApplicationPage />}
        />
        <Route path="/renew" element={<Renew />} />
        <Route path="/renewPage/:id/:bin" element={<RenewApplicationPage />} />
        <Route path="/feedback" element={<ClientFeedbackForm />} />

        <Route path="/registerPage" element={<RegisterPage />} />
        <Route path="/appTracker/:id" element={<AppTracker />} />
        <Route path="/renewal-form/step1" element={<RenewalFormStepper />} />
        <Route path="/FeedbackForm" element={<UniversalFeedbackForm />} />
        <Route
          path="/newApplicationRegister"
          element={<NewApplicationRegisterPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
