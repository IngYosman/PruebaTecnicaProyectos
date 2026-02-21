import { Menubar } from 'primereact/menubar';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from 'primereact/button';

export default function Layout() {
    const navigate = useNavigate();
    const { user, logout, isAdmin } = useAuthStore();

    const items = [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            command: () => navigate('/'),
        }
    ];

    if (isAdmin()) {
        items.push({
            label: 'Admin',
            icon: 'pi pi-cog',
            items: [
                { label: 'Proyectos', icon: 'pi pi-folder', command: () => navigate('/admin/proyectos') },
                { label: 'Usuarios', icon: 'pi pi-users', command: () => navigate('/admin/usuarios') },
                { label: 'Estados de Tareas', icon: 'pi pi-tags', command: () => navigate('/admin/estados') },
                { label: 'Tarifas', icon: 'pi pi-dollar', command: () => navigate('/admin/tarifas') },
            ]
        });
    }

    const end = (
        <div className="flex align-items-center gap-4">
            <span className="font-semibold text-gray-700">{user?.email}</span>
            <Button label="Salir" icon="pi pi-power-off" size="small" severity="danger" onClick={() => { logout(); navigate('/login'); }} />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="shadow-md bg-white">
                <Menubar model={items} end={end} className="border-none rounded-none px-6" />
            </header>
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}
