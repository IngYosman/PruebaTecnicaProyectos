import { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Messages } from 'primereact/messages';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { ColorPicker } from 'primereact/colorpicker';
import { InputSwitch } from 'primereact/inputswitch';
import api from '../../api/axios';

export default function AdminTaskStatuses() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [item, setItem] = useState({
        nombre: '',
        descripcion: '',
        orden: 1,
        color: '3498db',
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
            const response = await api.get('/tarea_estados');
            const result = response.data['hydra:member'] || response.data['member'] || (Array.isArray(response.data) ? response.data : []);
            setData(result);
        } catch {
            msgs.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los estados.' });
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = { ...item };
            if (item.id) {
                await api.put(`/tarea_estados/${item.id}`, payload);
                msgs.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Estado actualizado.' });
            } else {
                await api.post('/tarea_estados', payload);
                msgs.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Estado creado.' });
            }
            setVisible(false);
            setItem({ nombre: '', descripcion: '', orden: 1, color: '3498db', estado: true });
            loadData();
        } catch {
            msgs.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el estado.' });
        } finally {
            setSubmitting(false);
        }
    };

    const onEdit = (record) => {
        setItem(record);
        setVisible(true);
    };

    const actionBodyTemplate = (rowData) => {
        return <Button icon="pi pi-pencil" rounded text onClick={() => onEdit(rowData)} />;
    };

    const colorTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <div style={{ backgroundColor: `#${rowData.color}`, width: '20px', height: '20px', borderRadius: '4px', border: '1px solid #ddd' }}></div>
                <span>#{rowData.color}</span>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Estados de Tareas</h1>
                <Button label="Nuevo Estado" icon="pi pi-plus" onClick={() => { setItem({ nombre: '', descripcion: '', orden: 1, color: '3498db', estado: true }); setVisible(true); }} />
            </div>
            <Messages ref={msgs} />

            <Card>
                <DataTable value={data} loading={loading} emptyMessage="No hay estados." paginator rows={10}>
                    <Column field="id" header="ID" sortable></Column>
                    <Column field="orden" header="Orden" sortable></Column>
                    <Column field="nombre" header="Nombre" sortable></Column>
                    <Column field="color" header="Color" body={colorTemplate}></Column>
                    <Column field="estado" header="Estado" body={(rd) => rd.estado ? 'Activo' : 'Inactivo'} sortable></Column>
                    <Column body={actionBodyTemplate} header="Acciones"></Column>
                </DataTable>
            </Card>

            <Dialog header={item.id ? 'Editar Estado' : 'Nuevo Estado'} visible={visible} style={{ width: '30vw' }} onHide={() => setVisible(false)}>
                <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-2">
                    <div className="flex flex-col gap-2">
                        <label className="font-bold">Nombre</label>
                        <InputText value={item.nombre || ''} onChange={(e) => setItem({ ...item, nombre: e.target.value })} required placeholder="Ej: En Progreso" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-bold">Descripción</label>
                        <InputTextarea value={item.descripcion || ''} onChange={(e) => setItem({ ...item, descripcion: e.target.value })} rows={2} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="font-bold">Orden</label>
                            <InputNumber value={item.orden} onValueChange={(e) => setItem({ ...item, orden: e.value })} min={1} required />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-bold">Color</label>
                            <div className="flex align-items-center gap-2">
                                <ColorPicker value={item.color} onChange={(e) => setItem({ ...item, color: e.value })} />
                                <span className="font-mono pt-1">#{item.color}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                        <label className="font-bold">Estado</label>
                        <InputSwitch checked={item.estado} onChange={(e) => setItem({ ...item, estado: e.value })} />
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
