import { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Messages } from 'primereact/messages';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { InputSwitch } from 'primereact/inputswitch';
import { Password } from 'primereact/password';
import api from '../../api/axios';

export default function AdminUsers() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [item, setItem] = useState({
        email: '',
        nombre: '',
        roles: ['ROLE_USER'],
        password: '',
        estado: true
    });
    const [submitting, setSubmitting] = useState(false);

    const msgs = useRef(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/usuarios');
            setData(Array.isArray(response.data) ? response.data : (response.data?.member || []));
        } catch {
            msgs.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios.' });
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                email: item.email,
                nombre: item.nombre,
                roles: item.roles,
                estado: item.estado
            };

            if (item.password) {
                payload.plainPassword = item.password;
            }

            if (item.id) {
                await api.put(`/usuarios/${item.id}`, payload);
                msgs.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado.' });
            } else {
                await api.post('/usuarios', payload);
                msgs.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado.' });
            }
            setVisible(false);
            setItem({ email: '', nombre: '', roles: ['ROLE_USER'], password: '', estado: true });
            loadData();
        } catch (error) {
            msgs.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al intentar guardar el usuario.' });
        } finally {
            setSubmitting(false);
        }
    };

    const onEdit = (record) => {
        setItem({ ...record, password: '' });
        setVisible(true);
    };

    const toggleAdminRole = (checked) => {
        const roles = checked ? ['ROLE_USER', 'ROLE_ADMIN'] : ['ROLE_USER'];
        setItem({ ...item, roles });
    };

    const actionBodyTemplate = (rowData) => {
        return <Button icon="pi pi-pencil" rounded text onClick={() => onEdit(rowData)} />;
    };

    const roleTemplate = (rowData) => {
        const isAdmin = rowData.roles?.includes('ROLE_ADMIN');
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                {isAdmin ? 'Administrador' : 'Usuario'}
            </span>
        );
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Administrar Usuarios</h1>
                <Button label="Nuevo Usuario" icon="pi pi-plus" onClick={() => { setItem({ email: '', nombre: '', roles: ['ROLE_USER'], password: '', estado: true }); setVisible(true); }} />
            </div>
            <Messages ref={msgs} />

            <Card>
                <DataTable value={data} loading={loading} emptyMessage="No hay usuarios." paginator rows={10}>
                    <Column field="id" header="ID" sortable></Column>
                    <Column field="nombre" header="Nombre" sortable></Column>
                    <Column field="email" header="Email" sortable></Column>
                    <Column field="roles" header="Tipo de Perfil" body={roleTemplate} sortable></Column>
                    <Column field="estado" header="Estado" body={(rd) => rd.estado ? 'Activo' : 'Inactivo'} sortable></Column>
                    <Column body={actionBodyTemplate} header="Acciones"></Column>
                </DataTable>
            </Card>

            <Dialog header={item.id ? 'Editar Usuario' : 'Nuevo Usuario'} visible={visible} style={{ width: '40vw' }} onHide={() => setVisible(false)}>
                <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-2">
                    <div className="flex flex-col gap-2">
                        <label className="font-bold">Nombre Completo</label>
                        <InputText value={item.nombre || ''} onChange={(e) => setItem({ ...item, nombre: e.target.value })} required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-bold">Correo Electrónico</label>
                        <InputText type="email" value={item.email || ''} onChange={(e) => setItem({ ...item, email: e.target.value })} required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-bold">Contraseña {item.id && '(Dejar vacío para mantener actual)'}</label>
                        <Password
                            value={item.password || ''}
                            onChange={(e) => setItem({ ...item, password: e.target.value })}
                            required={!item.id}
                            toggleMask
                            feedback={!item.id}
                            className="w-full"
                            inputClassName="w-full"
                        />
                    </div>
                    <div className="flex items-center gap-6 mt-2">
                        <div className="flex items-center gap-2">
                            <Checkbox inputId="isAdmin" checked={item.roles?.includes('ROLE_ADMIN')} onChange={(e) => toggleAdminRole(e.checked)} />
                            <label htmlFor="isAdmin">Perfil de Administrador</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="font-bold">Activo</label>
                            <InputSwitch checked={item.estado} onChange={(e) => setItem({ ...item, estado: e.value })} />
                        </div>
                    </div>
                    <div className="flex justify-end mt-4 gap-2">
                        <Button label="Cancelar" icon="pi pi-times" text onClick={() => setVisible(false)} type="button" />
                        <Button label="Guardar" icon="pi pi-check" type="submit" loading={submitting} />
                    </div>
                </form>
            </Dialog>
        </div>
    );
}
