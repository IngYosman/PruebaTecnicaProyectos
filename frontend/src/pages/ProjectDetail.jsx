import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Messages } from 'primereact/messages';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';

export default function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [proyecto, setProyecto] = useState(null);
    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [nuevaTarea, setNuevaTarea] = useState({ id: null, titulo: '', descripcion: '', estado: null, horasTrabajadas: 0 });
    const [estados, setEstados] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [selectedUserFilter, setSelectedUserFilter] = useState(null);

    const msgs = useRef(null);
    const { user } = useAuthStore();

    useEffect(() => {
        loadData();
        loadEstados();
        loadUsuarios();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [resProyecto, resTareas] = await Promise.all([
                api.get(`/proyectos/${id}`),
                api.get(`/tareas?proyecto=${id}`)
            ]);
            setProyecto(resProyecto.data);
            setTareas(Array.isArray(resTareas.data) ? resTareas.data : (resTareas.data?.member || []));
        } catch (error) {
            msgs.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la información del proyecto.' });
        } finally {
            setLoading(false);
        }
    };

    const loadEstados = async () => {
        try {
            const res = await api.get('/tarea_estados');
            setEstados(Array.isArray(res.data) ? res.data : (res.data?.member || []));
        } catch { }
    };

    const loadUsuarios = async () => {
        try {
            const res = await api.get('/usuarios');
            setUsuarios(Array.isArray(res.data) ? res.data : (res.data?.member || []));
        } catch { }
    };

    const onSubmitTarea = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (!user?.id) throw new Error("Sesión no válida.");

            const payload = {
                titulo: nuevaTarea.titulo,
                descripcion: nuevaTarea.descripcion,
                proyecto: `/api/proyectos/${id}`,
                usuario: `/api/usuarios/${user.id}`,
                estado: nuevaTarea.estado ? `/api/tarea_estados/${nuevaTarea.estado}` : null,
                horasTrabajadas: parseInt(nuevaTarea.horasTrabajadas) || 0
            };

            if (nuevaTarea.id) {
                await api.put(`/tareas/${nuevaTarea.id}`, payload);
            } else {
                await api.post('/tareas', payload);
            }

            msgs.current?.show({ severity: 'success', summary: 'Éxito', detail: `Tarea registrada correctamente.` });
            setVisible(false);
            setNuevaTarea({ id: null, titulo: '', descripcion: '', estado: null, horasTrabajadas: 0 });
            await loadData();
        } catch (error) {
            msgs.current?.show({ severity: 'error', summary: 'Error', detail: error.response?.data?.['hydra:description'] || error.message || 'Error al procesar tarea.' });
        } finally {
            setSubmitting(false);
        }
    };

    const onEditTarea = (tarea) => {
        let estadoId = null;
        if (tarea.estado) {
            estadoId = typeof tarea.estado === 'object' ? tarea.estado.id : parseInt(tarea.estado.split('/').pop());
        }

        setNuevaTarea({
            id: tarea.id,
            titulo: tarea.titulo,
            descripcion: tarea.descripcion,
            estado: estadoId,
            horasTrabajadas: tarea.horasTrabajadas || 0
        });
        setVisible(true);
    };

    const formatLocalDateTime = (dateInput) => {
        if (!dateInput) return <span className="text-gray-400 italic text-xs">Sin fecha</span>;
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) return <span className="text-red-400">Error formato</span>;
        return (
            <span className="text-gray-600 font-medium">
                {date.toLocaleDateString()} <span className="text-gray-400 text-xs ml-1">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </span>
        );
    };

    const statusBodyTemplate = (rowData) => {
        const estado = rowData.estado;
        if (!estado) return <Tag value="Sin estado" severity="info" />;
        const nombre = typeof estado === 'object' ? estado.nombre : 'Cargando...';
        const color = typeof estado === 'object' && estado.color ? `#${estado.color}` : '#94a3b8';
        return <Tag value={nombre} style={{ backgroundColor: color }} className="font-bold px-3 py-1" />;
    };

    const userBodyTemplate = (rowData) => {
        return (
            <div className="flex items-center gap-2">
                <i className={`pi pi-user ${rowData.usuario?.id === user.id ? 'text-blue-500' : 'text-gray-400'}`}></i>
                <span className={`text-sm ${rowData.usuario?.id === user.id ? 'font-bold text-blue-700' : 'text-gray-600'}`}>
                    {rowData.usuario?.nombre || 'Desconocido'}
                    {rowData.usuario?.id === user.id && ' (Tú)'}
                </span>
            </div>
        );
    };

    const filteredTareas = selectedUserFilter
        ? tareas.filter(t => (t.usuario?.id || parseInt(t.usuario?.split('/').pop())) === selectedUserFilter)
        : tareas;

    if (loading) return <div className="flex justify-center items-center h-screen"><ProgressSpinner /></div>;

    if (!proyecto) return (
        <div className="text-center py-20">
            <i className="pi pi-exclamation-triangle text-6xl text-yellow-500 mb-4"></i>
            <h2 className="text-2xl font-bold">Proyecto no encontrado</h2>
            <Button label="Volver al Dashboard" icon="pi pi-arrow-left" text onClick={() => navigate('/')} className="mt-4" />
        </div>
    );

    return (
        <div className="flex flex-col gap-8 pb-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex flex-col gap-2">
                        <Button icon="pi pi-arrow-left" label="Volver al Dashboard" text onClick={() => navigate('/')} className="p-0 text-blue-600 font-bold hover:bg-transparent -ml-2 mb-2" />
                        <div className="flex items-center gap-4">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">{proyecto.nombre}</h1>
                            <Tag value={proyecto.estado ? 'Activo' : 'Inactivo'} severity={proyecto.estado ? 'success' : 'danger'} />
                        </div>
                        <p className="text-gray-500 max-w-2xl text-lg">{proyecto.descripcion}</p>
                    </div>
                    <Button label="Nueva Tarea" icon="pi pi-plus-circle" onClick={() => { setNuevaTarea({ id: null, titulo: '', descripcion: '', estado: null, horasTrabajadas: 0 }); setVisible(true); }} raised className="bg-blue-600 px-6 py-3 font-bold" />
                </div>
            </div>

            <Messages ref={msgs} />

            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4">
                    <div className="flex items-center gap-3">
                        <i className="pi pi-users text-blue-500 font-bold"></i>
                        <span className="font-bold text-gray-700">Ver tareas de:</span>
                        <Dropdown
                            value={selectedUserFilter}
                            options={usuarios}
                            onChange={(e) => setSelectedUserFilter(e.value)}
                            optionLabel="nombre"
                            optionValue="id"
                            placeholder="Todos los integrantes"
                            className="w-64"
                            showClear
                            filter
                        />
                    </div>
                    <div className="flex gap-4 text-sm">
                        <span className="text-gray-500 font-medium">Total: <b className="text-blue-600">{tareas.length}</b></span>
                        <span className="text-gray-500 font-medium">Filtradas: <b className="text-blue-600">{filteredTareas.length}</b></span>
                    </div>
                </div>

                <Card className="rounded-2xl shadow-md border-none overflow-hidden">
                    <DataTable value={filteredTareas} paginator rows={10} className="p-datatable-sm" stripedRows emptyMessage="No se encontraron tareas con estos criterios.">
                        <Column field="titulo" header="Tarea" className="font-bold text-gray-800" style={{ minWidth: '200px' }}></Column>
                        <Column header="Responsable" body={userBodyTemplate} sortable sortField="usuario.nombre" style={{ minWidth: '180px' }}></Column>
                        <Column header="Estado" body={statusBodyTemplate} sortable sortField="estado.nombre"></Column>
                        <Column field="horasTrabajadas" header="Horas" sortable className="text-center font-mono"></Column>
                        <Column header="Actualizada" body={(rd) => formatLocalDateTime(rd.updatedAt || rd.createdAt)} className="text-right"></Column>
                        <Column body={(rd) => rd.usuario?.id === user.id && <Button icon="pi pi-pencil" rounded text severity="warning" onClick={() => onEditTarea(rd)} />} header="Acciones" className="text-right"></Column>
                    </DataTable>
                </Card>
            </div>

            <Dialog header={<span className="text-xl font-bold">{nuevaTarea.id ? 'Editar Mi Tarea' : 'Nueva Tarea'}</span>} visible={visible} style={{ width: '450px' }} onHide={() => setVisible(false)} footer={<div className="flex justify-end gap-2 pt-4"> <Button label="Cancelar" icon="pi pi-times" text onClick={() => setVisible(false)} className="text-gray-500" /> <Button label="Guardar" icon="pi pi-check" onClick={onSubmitTarea} loading={submitting} className="bg-blue-600" /> </div>}>
                <div className="flex flex-col gap-4 mt-2">
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3">
                        <i className="pi pi-user text-blue-500 text-xl"></i>
                        <div>
                            <p className="text-xs text-gray-500 m-0 text-blue-400">Responsable de la tarea:</p>
                            <p className="text-sm font-bold text-blue-700 m-0">{user?.nombre || user?.email}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold text-gray-600">Título de la Tarea</label>
                        <InputText value={nuevaTarea.titulo} onChange={(e) => setNuevaTarea({ ...nuevaTarea, titulo: e.target.value })} required placeholder="¿Qué estás haciendo?" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold text-gray-600">Estado</label>
                            <Dropdown value={nuevaTarea.estado} options={estados} onChange={(e) => setNuevaTarea({ ...nuevaTarea, estado: e.value })} optionLabel="nombre" optionValue="id" placeholder="Selecciona" className="w-full" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold text-gray-600">Horas Trabajadas</label>
                            <InputText type="number" value={nuevaTarea.horasTrabajadas} onChange={(e) => setNuevaTarea({ ...nuevaTarea, horasTrabajadas: e.target.value })} placeholder="0" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold text-gray-600">Descripción detallada</label>
                        <InputTextarea value={nuevaTarea.descripcion} onChange={(e) => setNuevaTarea({ ...nuevaTarea, descripcion: e.target.value })} rows={3} autoResize placeholder="Añade más detalles si es necesario..." />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
