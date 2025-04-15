import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/PatientForm.css";

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', form.username);
        console.log('Login successful:', data);
        alert('Login successful!');
        navigate('/');
      } else {
        alert('Login failed: ' + JSON.stringify(data));
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <>
        <div className='register-container'>
            <form onSubmit={handleSubmit} className="login-form">

                <img alt='stellar-sleep img' src='/stellar_sleep.jpeg'></img>
                <p className='register-text'>Welcome back to <strong>Stellar Sleep</strong></p>
                <input
                    name="username"
                    type="username"
                    placeholder="Username"
                    value={form.username}
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
                <button type="submit" disabled={!form.username || !form.password} className="form-button">Login</button>

                <p>
                    Not a user?{' '}
                    <button type="button"  onClick={goToRegister} className="link-button">
                    Register here
                    </button>
                </p>
        </form>
        </div>
    </>

  );
};

export default Login;
