import { use, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { checkCredentials, getCredentials} from '../services/api';

function  Credentials() {

  const [Email, setEmail] = useState("");
  const [credentialsList, setCredentialsList] = useState([]);

    useEffect(()=>{
        const getCredentialList = async() =>{
            const result = await getCredentials();  
            setCredentialsList(result);
        }
        getCredentialList();

    }, []);

  const handleEmail = (e) => {

    setEmail(e)

  }

  

  const isEmail = (Email) => {

    return /\S+@\S+\.\S+/.test(Email);
  }

  const handleSearch= async () => {



    if (!Email.trim() || !isEmail(Email)) {
      alert("❌ Errore nelle credenziali.");
      return;
    }
    const { exists } = await checkCredentials(Email);

    if (!exists) {
      alert("❌ Account non esistente.");
      return;
    }


  /*await searchCredentials(Email);*/
    


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

      
      <button onClick={handleSearch}>cerca</button>
<div className="credentials-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
  {credentialsList.map(cred => (
    <div
      key={cred.email}
      style={{
        padding: '12px 16px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '4px',
      }}
    >
      <div style={{ fontWeight: 'bold', color: '#333' }}>📧 Email: <span style={{ fontWeight: 'normal' }}>{cred.email}</span></div>
      <div style={{ fontWeight: 'bold', color: '#333' }}>🔒 Password: <span style={{ fontWeight: 'normal' }}>{cred.password}</span></div>
    </div>
  ))}
</div>


      <Link to="/">vuoi creare un account?</Link>
      
    </div>
  )

}

export default Credentials
