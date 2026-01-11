import React from 'react';
import Card from '../../components/ui/Card';
import { Users, UserCheck, UserPlus, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <Card className="p-6">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-600 font-medium flex items-center gap-1">
                <TrendingUp size={16} />
                {change}
            </span>
            <span className="text-slate-400 ml-2">vs last month</span>
        </div>
    </Card>
);

const DashboardHome = () => {
    const stats = [
        { title: 'Total Members', value: '2,543', change: '+12.5%', icon: Users, color: 'bg-blue-500' },
        { title: 'Active Members', value: '1,980', change: '+5.2%', icon: UserCheck, color: 'bg-emerald-500' },
        { title: 'New Registrations', value: '145', change: '+24.3%', icon: UserPlus, color: 'bg-violet-500' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
                <p className="text-slate-500">Welcome back, here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 h-64 flex items-center justify-center border-dashed border-2 border-slate-200">
                    <p className="text-slate-400">Membership Growth Chart Placeholder</p>
                </Card>
                <Card className="p-6 h-64 flex items-center justify-center border-dashed border-2 border-slate-200">
                    <p className="text-slate-400">Recent Activities Placeholder</p>
                </Card>
            </div>
        </div>
    );
};

export default DashboardHome;
