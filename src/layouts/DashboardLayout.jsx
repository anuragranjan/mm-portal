import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, FileText, Settings, LogOut } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, to, active }) => {
    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
        >
            <Icon size={20} />
            <span>{label}</span>
        </Link>
    );
};

const DashboardLayout = () => {
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', to: '/dashboard' },
        { icon: Users, label: 'Members', to: '/dashboard/members' },
        { icon: UserPlus, label: 'New Registration', to: '/dashboard/register' },
        { icon: FileText, label: 'Reports', to: '/dashboard/reports' },
        { icon: Settings, label: 'Settings', to: '/dashboard/settings' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-2xl font-bold text-primary-600">MM Portal</h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.to}
                            {...item}
                            active={location.pathname === item.to}
                        />
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10 md:hidden">
                    <h1 className="text-xl font-bold text-primary-600">MM Portal</h1>
                </header>
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
