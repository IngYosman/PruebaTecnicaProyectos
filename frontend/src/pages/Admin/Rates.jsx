import { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Messages } from 'primereact/messages';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputSwitch } from 'primereact/inputswitch';
import { Dropdown } from 'primereact/dropdown';
import api from '../../api/axios';

export default function AdminRates() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [item, setItem] = useState({
        nombre: '',
        descripcion: '',
        valorPorHora: 0,
        moneda: 'USD',
        estado: true
    });
    const [submitting, setSubmitting] = useState(false);

    const msgs = useRef(null);
    const monedas = [
        { label: 'Dólar (USD)', value: 'USD' },
        { label: 'Euro (EUR)', value: 'EUR' },
        { label: 'Peso Colombiano (COP)', value: 'COP' }
    ];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/tarifas');
            const result = response.data['hydra:member'] || response.data['member'] || (Array.isArray(response.data) ? response.data : []);
            setData(result);
        } catch {
            msgs.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las tarifas.' });
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...item,
                valorPorHora: item.valorPorHora.toString()
            };

            if (item.id) {
                await api.put(`/tarifas/${item.id}`, payload);
                msgs.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Tarifa actualizada.' });
            } else {
                await api.post('/tarifas', payload);
                msgs.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Tarifa creada.' });
            }
            setVisible(false);
            setItem({ nombre: '', descripcion: '', valorPorHora: 0, moneda: 'USD', estado: true });
            loadData();
        } catch {
            msgs.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la tarifa.' });
        } finally {
            setSubmitting(false);
        }
    };

    const onEdit = (record) => {
        setItem({ ...record, valorPorHora: parseFloat(record.valorPorHora) });
        setVisible(true);
    };

    const actionBodyTemplate = (rowData) => {
        return <Button icon="pi pi-pencil" rounded text onClick={() => onEdit(rowData)} />;
    };

    const statusTemplate = (rowData) => {
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${rowData.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {rowData.estado ? 'Activa' : 'Inactiva'}
            </span>
        );
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Administrar Tarifas</h1>
                <Button label="Nueva Tarifa" icon="pi pi-plus" onClick={() => { setItem({ nombre: '', descripcion: '', valorPorHora: 0, moneda: 'USD', estado: true }); setVisible(true); }} />
            </div>
            <Messages ref={msgs} />

            <Card>
                <DataTable value={data} loading={loading} emptyMessage="No hay tarifas." paginator rows={10}>
                    <Column field="id" header="ID" sortable></Column>
                    <Column field="nombre" header="Nombre" sortable></Column>
                    <Column field="valorPorHora" header="Valor/Hora" body={(rd) => `${rd.valorPorHora} ${rd.moneda}`} sortable></Column>
                    <Column field="estado" header="Estado" body={statusTemplate} sortable></Column>
                    <Column body={actionBodyTemplate} header="Acciones"></Column>
                </DataTable>
            </Card>

            <Dialog header={item.id ? 'Editar Tarifa' : 'Nueva Tarifa'} visible={visible} style={{ width: '35vw' }} onHide={() => setVisible(false)}>
                <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-2">
                    <div className="flex flex-col gap-2">
                        <label className="font-bold">Nombre</label>
                        <InputText value={item.nombre || ''} onChange={(e) => setItem({ ...item, nombre: e.target.value })} required placeholder="Ej: Tarifa Senior" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-bold">Descripción</label>
                        <InputTextarea value={item.descripcion || ''} onChange={(e) => setItem({ ...item, descripcion: e.target.value })} required rows={2} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="font-bold">Valor por Hora</label>
                            <InputNumber value={item.valorPorHora} onValueChange={(e) => setItem({ ...item, valorPorHora: e.value })} minFractionDigits={2} required />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-bold">Moneda</label>
                            <Dropdown value={item.moneda} options={monedas} onChange={(e) => setItem({ ...item, moneda: e.value })} required />
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
