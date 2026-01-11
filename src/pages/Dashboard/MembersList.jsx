import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Search, Filter, MoreVertical, Edit, Trash2 } from 'lucide-react';
import MemberModal from './MemberModal';

const MembersList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [members, setMembers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 (555) 123-4567', address: '123 Main St, New York, NY', pan: 'ABCDE1234F', status: 'Active', joinDate: '2023-01-15', plan: 'Premium' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 (555) 987-6543', address: '456 Oak Ave, Los Angeles, CA', pan: 'FGHIJ5678K', status: 'Inactive', joinDate: '2023-02-20', plan: 'Basic' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+1 (555) 456-7890', address: '789 Pine Rd, Chicago, IL', pan: 'LMNOP9012Q', status: 'Active', joinDate: '2023-03-10', plan: 'Premium' },
        { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', phone: '+1 (555) 234-5678', address: '321 Elm St, Houston, TX', pan: 'RSTUV3456W', status: 'Active', joinDate: '2023-04-05', plan: 'Basic' },
        { id: 5, name: 'David Brown', email: 'david@example.com', phone: '+1 (555) 876-5432', address: '654 Maple Dr, Miami, FL', pan: 'XYZAB7890C', status: 'Pending', joinDate: '2023-05-12', plan: 'Basic' },
    ]);

    const handleAddMember = (newMember) => {
        const id = Math.max(...members.map(m => m.id)) + 1;
        const date = new Date().toISOString().split('T')[0];
        setMembers([{ ...newMember, id, joinDate: date }, ...members]);
    };

    const handleEditMember = (updatedMember) => {
        setMembers(members.map(m => m.id === updatedMember.id ? { ...updatedMember, joinDate: m.joinDate } : m));
        setEditingMember(null);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to remove this member?')) {
            setMembers(members.filter(m => m.id !== id));
        }
    };

    const openEditModal = (member) => {
        setEditingMember(member);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingMember(null);
        setIsModalOpen(true);
    };

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.phone.includes(searchQuery)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Members</h2>
                    <p className="text-slate-500">Manage your NGO members here.</p>
                </div>
                <Button onClick={openAddModal}>Add New Member</Button>
            </div>

            <Card className="overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <Input
                            placeholder="Search members..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="secondary" size="sm" className="flex items-center gap-2">
                        <Filter size={16} />
                        Filter
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-900 font-medium">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Plan</th>
                                <th className="px-6 py-4">Join Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredMembers.map((member) => (
                                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">{member.name}</div>
                                                <div className="text-slate-400 text-xs">{member.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{member.phone}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${member.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                                                member.status === 'Inactive' ? 'bg-slate-100 text-slate-800' :
                                                    'bg-amber-100 text-amber-800'}`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{member.plan}</td>
                                    <td className="px-6 py-4">{member.joinDate}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(member)}
                                                className="p-2 text-slate-400 hover:text-primary-600 transition-colors"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(member.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <MemberModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                member={editingMember}
                onSave={editingMember ? handleEditMember : handleAddMember}
            />
        </div>
    );
};

export default MembersList;
