import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/PatientForm.css";



interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const [form, setForm] = useState<RegisterForm>({
    username: '',
    email: '',
    password: ''
  });

const navigate = useNavigate();

const goToLogin = () => {
    navigate('/login');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Registration successful!');
        console.log('Registration successful');
      } else {
        alert('Error: ' + JSON.stringify(data));
        console.log('Error: ' + JSON.stringify(data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
        

        
        <div className='register-container'>
            <form onSubmit={handleSubmit}>
            <img alt='stellar-sleep img' src='/stellar_sleep.jpeg'></img>
            <h2>Register</h2>
            <input
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="form-input"
            /><br />
            <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="form-input"
            /><br />
            <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="form-input"
            /><br />
            <button type="submit" disabled={!form.username || !form.email || !form.password}
                className="form-button" onClick={goToLogin}>Register</button>
        </form>
        </div>
    </>

  );
};

export default Register;
