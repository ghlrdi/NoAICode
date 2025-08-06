import { use, useState } from 'react'
import { Link } from 'react-router-dom'
import { checkAllCredentials, delCredentials} from '../services/api';


function DelAccount() {

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

  const handleDel = async () => {

    if (!Email.trim() || !isEmail(Email) || !Password.trim()) {
      alert("❌ Errore nelle credenziali.");
      return;
    }

    const { exists } = await checkAllCredentials(Email, Password);

    if (!exists) {
      alert("❌ credenziali errate");
      return;
    }


    await delCredentials(Email);
    alert("✅ Account eliminato con successo.");


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
        placeholder='password'
        onChange={(e) => { handlePass(e.target.value) }}


      ></input>

      <button onClick={handleDel}>delete</button>


    </div>
  )

}

export default DelAccount
