import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const msgs = useRef(null);
    const navigate = useNavigate();
    const login = useAuthStore(state => state.login);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        msgs.current?.clear();
        try {
            const response = await api.post('/login_check', { email, password });
            login(response.data.token);
            navigate('/');
        } catch (error) {
            msgs.current?.show({ severity: 'error', summary: 'Error', detail: 'Credenciales inválidas' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Iniciar Sesión</h2>
                <Messages ref={msgs} />
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="font-semibold text-sm text-gray-700">Correo Electrónico</label>
                        <InputText
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-inputtext-sm"
                            placeholder="admin@ejemplo.com"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="font-semibold text-sm text-gray-700">Contraseña</label>
                        <Password
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            feedback={false}
                            toggleMask
                            required
                            className="w-full"
                            inputClassName="w-full p-inputtext-sm"
                            placeholder="********"
                        />
                    </div>
                    <Button label="Ingresar" icon="pi pi-sign-in" loading={loading} className="w-full mt-2" type="submit" />
                </form>
            </div>
        </div>
    );
}
