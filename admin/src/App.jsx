import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Cenro from './BACKROOM/CENRO/cenro'
import Cho from './BACKROOM/CHO/cho'
import Cmswo from './BACKROOM/CMSWO/cmswo'
import Obo from './BACKROOM/OBO/obo'
import Zoning from './BACKROOM/ZONING/zoning'
import Dashboard from './DASHBOARD/dashboard'
import Login from './LOGIN/login'
import New_records from './NEW_RECORDS/new_records'
import Profile from './PROFILE/profile'
import Renew_records from './RENEW_RECORDS/renew_records'

function App() {


  return (
    <BrowserRouter>
      <Routes>
  
        <Route path="/" element={<Login/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/new_records" element={<New_records/>}></Route>
        <Route path="/renew_records" element={<Renew_records/>}></Route>
        <Route path="/profile" element={<Profile/>}></Route>
        <Route path="/cenro" element={<Cenro/>}></Route>
        <Route path="/cho" element={<Cho/>}></Route>
        <Route path="/cmswo" element={<Cmswo/>}></Route>
        <Route path="/zoning" element={<Zoning/>}></Route>
        <Route path="/obo" element={<Obo/>}></Route>
        
      </Routes>
    
    </BrowserRouter>
  )
}

export default App
