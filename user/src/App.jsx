import { BrowserRouter, Route, Routes } from 'react-router-dom'

import HomePage from './homePage/homePage'
import LoginPage from './loginPage/loginPage'
import NewApplicationPage from './NewApplicationPage/newApplicationPage'

function App() {
  return (
    <BrowserRouter>

          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/homePage" element={<HomePage />} />
            <Route path="/newApplicationPage" element={<NewApplicationPage />} />
          </Routes>

    </BrowserRouter>
  )
}

export default App;