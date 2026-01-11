import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { X } from 'lucide-react';

const MemberModal = ({ isOpen, onClose, member = null, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        pan: '',
        role: 'Member',
        status: 'Active'
    });

    useEffect(() => {
        if (member) {
            setFormData(member);
        } else {
            setFormData({ name: '', email: '', phone: '', address: '', pan: '', role: 'Member', status: 'Active' });
        }
    }, [member]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <Card className="w-full max-w-lg bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">
                        {member ? 'Edit Member' : 'Add New Member'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <Input
                        label="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="John Doe"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            placeholder="john@example.com"
                        />
                        <Input
                            label="Phone Number"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="PAN Number"
                            value={formData.pan}
                            onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                            placeholder="ABCDE1234F"
                        />
                        <Input
                            label="Address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="123 Main St"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select
                                className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option>Active</option>
                                <option>Inactive</option>
                                <option>Pending</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Plan</label>
                            <select
                                className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                value={formData.plan || 'Basic'} // Default
                                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                            >
                                <option>Basic</option>
                                <option>Premium</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {member ? 'Save Changes' : 'Create Member'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default MemberModal;
