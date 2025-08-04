// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email, senha });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
      console.log('Redirecionando para dashboard...');
    } catch (err) {
      console.error('Erro no login:', err);
      alert('Email ou senha inválidos.');
    }
  };
  
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        className="mb-3 p-2 border rounded w-72"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        className="mb-5 p-2 border rounded w-72"
        onChange={(e) => setSenha(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
      >
        Entrar
      </button>
    </div>
  );
}
