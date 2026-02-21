import { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Messages } from 'primereact/messages';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { InputSwitch } from 'primereact/inputswitch';
import { Dropdown } from 'primereact/dropdown';
import api from '../../api/axios';

export default function AdminProjects() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [assignVisible, setAssignVisible] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const [users, setUsers] = useState([]);
    const [rates, setRates] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [newAssignment, setNewAssignment] = useState({
        usuario: null,
        tarifa: null,
        rolEnProyecto: 'Desarrollador',
        fechaAsignacion: new Date(),
        estado: true
    });

    const [item, setItem] = useState({
        nombre: '',
        descripcion: '',
        fechaInicio: null,
        fechaFin: null,
        estado: true
    });
    const [submitting, setSubmitting] = useState(false);

    const msgs = useRef(null);
    const assignMsgs = useRef(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/proyectos');
            setData(Array.isArray(response.data) ? response.data : (response.data?.member || []));
        } catch {
            msgs.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos.' });
        } finally {
            setLoading(false);
        }
    };

    const loadAssignmentData = async () => {
        try {
            const [respUsers, respRates] = await Promise.all([
                api.get('/usuarios'),
                api.get('/tarifas')
            ]);
            setUsers(Array.isArray(respUsers.data) ? respUsers.data : (respUsers.data?.member || []));
            setRates(Array.isArray(respRates.data) ? respRates.data : (respRates.data?.member || []));
        } catch (e) {
            console.error("Error loading users/rates", e);
        }
    };

    const loadProjectAssignments = async (projectId) => {
        try {
            const response = await api.get(`/usuario_proyectos?proyecto=${projectId}`);
            setAssignments(Array.isArray(response.data) ? response.data : (response.data?.member || []));
        } catch (e) {
            console.error("Error loading assignments", e);
        }
    };

    const onAssignUsers = async (project) => {
        setSelectedProject(project);
        setAssignVisible(true);
        await Promise.all([
            loadAssignmentData(),
            loadProjectAssignments(project.id)
        ]);
    };

    const handleAddAssignment = async () => {
        if (!newAssignment.usuario || !newAssignment.tarifa) {
            assignMsgs.current?.show({ severity: 'warn', summary: 'Atención', detail: 'Debe seleccionar un usuario y una tarifa.' });
            return;
        }

        try {
            const payload = {
                usuario: `/api/usuarios/${newAssignment.usuario}`,
                proyecto: `/api/proyectos/${selectedProject.id}`,
                tarifa: `/api/tarifas/${newAssignment.tarifa}`,
                rolEnProyecto: newAssignment.rolEnProyecto,
                fechaAsignacion: newAssignment.fechaAsignacion.toISOString(),
                estado: newAssignment.estado
            };
            await api.post('/usuario_proyectos', payload);
            loadProjectAssignments(selectedProject.id);
            setNewAssignment({ usuario: null, tarifa: null, rolEnProyecto: 'Desarrollador', fechaAsignacion: new Date(), estado: true });
            assignMsgs.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario asignado correctamente.' });
        } catch (error) {
            assignMsgs.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo realizar la asignación.' });
        }
    };

    const handleDeleteAssignment = async (id) => {
        try {
            await api.delete(`/usuario_proyectos/${id}`);
            loadProjectAssignments(selectedProject.id);
        } catch (e) {
            assignMsgs.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la asignación.' });
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...item,
                fechaInicio: item.fechaInicio instanceof Date ? item.fechaInicio.toISOString() : item.fechaInicio,
                fechaFin: item.fechaFin instanceof Date ? item.fechaFin.toISOString() : item.fechaFin
            };

            if (item.id) {
                await api.put(`/proyectos/${item.id}`, payload);
                msgs.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Proyecto actualizado.' });
            } else {
                await api.post('/proyectos', payload);
                msgs.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Proyecto creado.' });
            }
            setVisible(false);
            setItem({ nombre: '', descripcion: '', fechaInicio: null, fechaFin: null, estado: true });
            loadData();
        } catch (error) {
            msgs.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el proyecto.' });
        } finally {
            setSubmitting(false);
        }
    };

    const onEdit = (record) => {
        setItem({
            ...record,
            fechaInicio: record.fechaInicio ? new Date(record.fechaInicio) : null,
            fechaFin: record.fechaFin ? new Date(record.fechaFin) : null
        });
        setVisible(true);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" rounded text onClick={() => onEdit(rowData)} tooltip="Editar Proyecto" />
                <Button icon="pi pi-users" rounded text severity="help" onClick={() => onAssignUsers(rowData)} tooltip="Asignar Usuarios" />
            </div>
        );
    };

    const dateTemplate = (rowData, field) => {
        const date = rowData[field];
        return date ? new Date(date).toLocaleDateString() : '';
    };

    const statusTemplate = (rowData) => {
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${rowData.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {rowData.estado ? 'Activo' : 'Inactivo'}
            </span>
        );
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Administrar Proyectos</h1>
                <Button label="Nuevo Proyecto" icon="pi pi-plus" onClick={() => { setItem({ nombre: '', descripcion: '', fechaInicio: null, fechaFin: null, estado: true }); setVisible(true); }} />
            </div>
            <Messages ref={msgs} />

            <Card>
                <DataTable value={data} loading={loading} emptyMessage="No hay proyectos." paginator rows={10}>
                    <Column field="id" header="ID" sortable></Column>
                    <Column field="nombre" header="Nombre" sortable></Column>
                    <Column field="descripcion" header="Descripción" body={(rowData) => <div className="max-w-xs truncate">{rowData.descripcion}</div>}></Column>
                    <Column field="fechaInicio" header="F. Inicio" body={(rd) => dateTemplate(rd, 'fechaInicio')} sortable></Column>
                    <Column field="fechaFin" header="F. Fin" body={(rd) => dateTemplate(rd, 'fechaFin')} sortable></Column>
                    <Column field="estado" header="Estado" body={statusTemplate} sortable></Column>
                    <Column body={actionBodyTemplate} header="Acciones"></Column>
                </DataTable>
            </Card>

            <Dialog header={item.id ? 'Editar Proyecto' : 'Nuevo Proyecto'} visible={visible} style={{ width: '45vw' }} onHide={() => setVisible(false)}>
                <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-2">
                    <div className="flex flex-col gap-2">
                        <label className="font-bold">Nombre del Proyecto</label>
                        <InputText value={item.nombre || ''} onChange={(e) => setItem({ ...item, nombre: e.target.value })} required placeholder="Ej: Rediseño Web" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-bold">Descripción</label>
                        <InputTextarea value={item.descripcion || ''} onChange={(e) => setItem({ ...item, descripcion: e.target.value })} required rows={3} autoResize />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="font-bold">Fecha Inicio</label>
                            <Calendar value={item.fechaInicio} onChange={(e) => setItem({ ...item, fechaInicio: e.value })} showIcon required />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-bold">Fecha Finalización</label>
                            <Calendar value={item.fechaFin} onChange={(e) => setItem({ ...item, fechaFin: e.value })} showIcon minDate={item.fechaInicio} required />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                        <label className="font-bold">¿Proyecto Activo?</label>
                        <InputSwitch checked={item.estado} onChange={(e) => setItem({ ...item, estado: e.value })} />
                    </div>
                    <div className="flex justify-end mt-4 gap-2">
                        <Button label="Cancelar" icon="pi pi-times" text onClick={() => setVisible(false)} type="button" />
                        <Button label="Guardar Proyecto" icon="pi pi-check" type="submit" loading={submitting} />
                    </div>
                </form>
            </Dialog>

            <Dialog header={`Asignar Usuarios a: ${selectedProject?.nombre}`} visible={assignVisible} style={{ width: '60vw' }} onHide={() => setAssignVisible(false)}>
                <div className="flex flex-col gap-6">
                    <Messages ref={assignMsgs} />

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-bold mb-3">Nueva Asignación</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 align-items-end">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold">Usuario</label>
                                <Dropdown value={newAssignment.usuario} options={users} onChange={(e) => setNewAssignment({ ...newAssignment, usuario: e.value })} optionLabel="nombre" optionValue="id" placeholder="Seleccione Usuario" className="w-full" filter />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold">Tarifa</label>
                                <Dropdown value={newAssignment.tarifa} options={rates} onChange={(e) => setNewAssignment({ ...newAssignment, tarifa: e.value })} optionLabel="nombre" optionValue="id" placeholder="Seleccione Tarifa" className="w-full" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold">Rol</label>
                                <InputText value={newAssignment.rolEnProyecto} onChange={(e) => setNewAssignment({ ...newAssignment, rolEnProyecto: e.target.value })} placeholder="Ej: Desarrollador Backend" className="w-full" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold">Fecha Asignación</label>
                                <Calendar value={newAssignment.fechaAsignacion} onChange={(e) => setNewAssignment({ ...newAssignment, fechaAsignacion: e.value })} showIcon className="w-full" />
                            </div>
                            <div className="flex items-center gap-2 pb-2">
                                <InputSwitch checked={newAssignment.estado} onChange={(e) => setNewAssignment({ ...newAssignment, estado: e.value })} />
                                <label className="text-sm font-semibold">Activo</label>
                            </div>
                            <Button label="Asignar" icon="pi pi-plus" onClick={handleAddAssignment} severity="success" />
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold mb-3">Usuarios Asignados Actualmente</h3>
                        <DataTable value={assignments} size="small" emptyMessage="No hay usuarios asignados a este proyecto.">
                            <Column field="usuario.nombre" header="Usuario"></Column>
                            <Column field="tarifa.nombre" header="Tarifa"></Column>
                            <Column field="rolEnProyecto" header="Rol"></Column>
                            <Column field="fechaAsignacion" header="F. Asignación" body={(rd) => new Date(rd.fechaAsignacion).toLocaleDateString()}></Column>
                            <Column header="Estado" body={(rd) => rd.estado ? '✅' : '❌'} align="center"></Column>
                            <Column body={(rd) => <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => handleDeleteAssignment(rd.id)} />} header="Acciones" align="center"></Column>
                        </DataTable>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
