import { Routes, Route } from 'react-router-dom'
import ForgotPass from './ForgotPass.jsx'
import App from './App.jsx'
import DelAccount from './DelAccount.jsx'
import Credentials from './Credentials.jsx'
function Rotte() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/forgotpass" element={<ForgotPass />} />
      <Route path="/delAccount" element={<DelAccount />}/>
      <Route path="/credentials" element={<Credentials />}/>

    </Routes>
  )
}

export default Rotte
