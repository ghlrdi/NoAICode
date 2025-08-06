import { use, useState } from 'react'
import './App.css'
import { checkCredentials, saveCredentials } from '../services/api';
import { Link } from 'react-router-dom'

function App() {

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("")

  const handleEmail = (e) => {

    setEmail(e)

  }

  const handlePass = (e) => {

    setPassword(e)

  };

  const isEmail = (Email) => {

    return /\S+@\S+\.\S+/.test(Email);
  }


  const handleSave = async () => {

    if (!Email.trim() || !isEmail(Email) || !Password.trim()) {
      alert("❌ Errore nelle credenziali.");
      return;
    }

    const { exists } = await checkCredentials(Email);

    if (exists) {
      alert("❌ Account già esistente.");
      return;
    }

    await saveCredentials(Email, Password);
    alert("✅ Account creato con successo.");
  };


  return (
    <>
      <div className="App">
        <h1>Login <Link to="/credentials">Accounts</Link></h1>

        <div
          className="card"
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

          <input
            onChange={(e) => { handleEmail(e.target.value) }}
            type='email'
            placeholder='email'
          ></input>

          <input
            type='password'
            placeholder='password'
            onChange={(e) => { handlePass(e.target.value) }}

          ></input>

          <button onClick={handleSave}>
            sign in
          </button>

          <Link to="/forgotpass">password dimenticata?</Link>


        </div>
      </div>
    </>
  )
}

export default App
