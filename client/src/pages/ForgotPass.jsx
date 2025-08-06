import { use, useState } from 'react'
import { Link } from 'react-router-dom'
import { checkCredentials, changeCredentials } from '../services/api';

function ForgotPass() {

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

  const handleChange = async () => {

    if (!Email.trim() || !isEmail(Email) || !Password.trim()) {
      alert("❌ Errore nelle credenziali.");
      return;
    }
    const { exists } = await checkCredentials(Email);

    if (!exists) {
      alert("❌ Account non esistente.");
      return;
    }


    await changeCredentials(Email, Password);
    alert("✅ Account modificato con successo.");


  };

  return (
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
        placeholder='password nuova'
        onChange={(e) => { handlePass(e.target.value) }}


      ></input>

      <button onClick={handleChange}>cambia password</button>

      <Link to="/delAccount">vuoi eliminare l'account?</Link>
      

    </div>
  )

}

export default ForgotPass
