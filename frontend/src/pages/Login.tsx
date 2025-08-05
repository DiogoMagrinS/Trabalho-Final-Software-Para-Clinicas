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
    } catch (err) {
      console.error('Erro no login:', err);
      alert('Email ou senha inválidos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-300 via-purple-200 to-pink-200">
      <div className="relative w-full max-w-sm">
        {/* Logo flutuante */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center">
          <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
        </div>

        {/* Card de Login */}
        <div className="bg-white shadow-2xl rounded-2xl p-10 pt-20">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Entrar</h1>

          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />

            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />

            <button
              onClick={handleLogin}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-md"
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}