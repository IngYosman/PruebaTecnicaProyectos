import { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
    const [proyectos, setProyectos] = useState([]);
    const [loading, setLoading] = useState(true);
    const msgs = useRef(null);
    const navigate = useNavigate();
    const { user } = useAuthStore();

    useEffect(() => {
        loadProyectos();
    }, []);

    const loadProyectos = async () => {
        setLoading(true);
        try {
            const response = await api.get('/proyectos');
            setProyectos(Array.isArray(response.data) ? response.data : (response.data?.member || []));
        } catch (error) {
            msgs.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los proyectos.' });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 pb-10">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Bienvenido, {user?.nombre || user?.email}</h1>
                    <p className="text-gray-500 mt-1">Gestiona tus proyectos y tareas asignadas</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-full">
                    <i className="pi pi-briefcase text-blue-600 text-2xl"></i>
                </div>
            </div>

            <Messages ref={msgs} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {proyectos.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                        <i className="pi pi-folder-open text-gray-300 text-6xl mb-4"></i>
                        <p className="text-gray-400 text-xl font-medium">No tienes proyectos asignados actualmente.</p>
                    </div>
                ) : (
                    proyectos.map((proyecto) => (
                        <Card
                            key={proyecto.id}
                            title={<span className="text-xl font-bold text-gray-800 line-clamp-1">{proyecto.nombre}</span>}
                            subTitle={<span className="text-blue-500 font-medium">{proyecto.estado ? '✅ Activo' : '❌ Inactivo'}</span>}
                            className="hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500 cursor-pointer overflow-hidden group"
                            onClick={() => navigate(`/proyectos/${proyecto.id}`)}
                        >
                            <p className="text-gray-600 line-clamp-3 mb-4 min-h-[4.5rem]">
                                {proyecto.descripcion || 'Sin descripción disponible.'}
                            </p>

                            <div className="flex flex-col gap-3 pt-4 border-t border-gray-50">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span className="flex align-items-center gap-2">
                                        <i className="pi pi-calendar text-xs"></i>
                                        Inicio: {proyecto.fechaInicio ? new Date(proyecto.fechaInicio).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <Button
                                    label="Ver Tareas"
                                    icon="pi pi-arrow-right"
                                    iconPos="right"
                                    className="p-button-text p-button-sm self-end group-hover:translate-x-1 transition-transform"
                                />
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
