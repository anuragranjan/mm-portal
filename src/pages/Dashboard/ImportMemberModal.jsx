import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { X, Upload, FileSpreadsheet, Check, AlertCircle, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';

const ImportMemberModal = ({ isOpen, onClose, onImport }) => {
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [parsedMembers, setParsedMembers] = useState([]);
    const [error, setError] = useState('');
    const [step, setStep] = useState('upload'); // upload, preview

    if (!isOpen) return null;

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError('');
            processExcel(selectedFile);
        }
    };

    const processExcel = async (excelFile) => {
        setIsProcessing(true);
        setParsedMembers([]);
        try {
            const arrayBuffer = await excelFile.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });

            // Assume first sheet
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

            const extractedMembers = parseExcelData(jsonData);

            if (extractedMembers.length === 0) {
                setError('Could not identify any valid member records. Please check the Excel format (Name, Mobile, Email id).');
            } else {
                setParsedMembers(extractedMembers);
                setStep('preview');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to process Excel file. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const parseExcelData = (rows) => {
        const members = [];

        // Helper to find value case-insensitively and trimming whitespace
        const getValue = (row, ...candidates) => {
            const keys = Object.keys(row);
            for (const candidate of candidates) {
                const match = keys.find(k => k.trim().toLowerCase() === candidate.toLowerCase());
                if (match) return row[match];
            }
            return undefined;
        };

        rows.forEach(row => {
            const name = getValue(row, 'Name', 'name');
            // Explicitly prioritize 'Mobile' as requested, but fallbacks allow for 'Phone' if Mobile is missing
            const mobile = getValue(row, 'Mobile', 'mobile', 'Phone', 'Cell');
            // 'Email id' is from the screenshot, 'Email' as backup
            const rawEmail = getValue(row, 'Email id', 'Email', 'email', 'E-mail');

            if (name) {
                const member = {
                    name: String(name).trim(),
                    email: extractEmail(rawEmail),
                    phone: String(mobile || '').trim(),
                    address: '',
                    pan: '',
                    yearOfGraduation: '',
                    currentEmployment: '',
                    designation: '',
                    photo: '',
                    joinDate: new Date().toISOString().split('T')[0],
                    status: 'Active',
                    role: 'Member',
                    plan: 'Basic'
                };
                members.push(member);
            }
        });

        return members;
    };

    const extractEmail = (raw) => {
        if (!raw) return '';
        const str = String(raw);

        // improved regex to find the first valid email address in a string
        // useful for "Name <email@example.com>" or "email1@a.com & email2@b.com"
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i;
        const match = str.match(emailRegex);
        return match ? match[0] : '';
    };

    const handleConfirmImport = () => {
        onImport(parsedMembers);
        onClose();
        setStep('upload');
        setFile(null);
        setParsedMembers([]);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <Card className="w-full max-w-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Import Members from Excel</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {step === 'upload' ? (
                        <div className="text-center space-y-6">
                            <div
                                className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
                                onClick={() => document.getElementById('excel-upload').click()}
                            >
                                {isProcessing ? (
                                    <Loader2 size={48} className="text-primary-500 animate-spin mb-4" />
                                ) : (
                                    <FileSpreadsheet size={48} className="text-emerald-500 mb-4" />
                                )}
                                <h3 className="text-lg font-medium text-slate-900">
                                    {isProcessing ? 'Processing Excel...' : 'Click to upload Excel'}
                                </h3>
                                <p className="text-slate-500 text-sm mt-2">
                                    Supports .xlsx, .xls files
                                </p>
                                <input
                                    id="excel-upload"
                                    type="file"
                                    accept=".xlsx, .xls"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    disabled={isProcessing}
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm justify-center">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium text-slate-900">Found {parsedMembers.length} records</h3>
                                <Button variant="secondary" size="sm" onClick={() => setStep('upload')}>Upload Different File</Button>
                            </div>

                            <div className="border border-slate-200 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                                <table className="w-full text-left text-sm text-slate-600">
                                    <thead className="bg-slate-50 text-slate-900 font-medium sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2">Name</th>
                                            <th className="px-4 py-2">Email</th>
                                            <th className="px-4 py-2">Phone</th>
                                            <th className="px-4 py-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {parsedMembers.map((m, i) => (
                                            <tr key={i}>
                                                <td className="px-4 py-2 font-medium">{m.name}</td>
                                                <td className="px-4 py-2">{m.email}</td>
                                                <td className="px-4 py-2">{m.phone}</td>
                                                <td className="px-4 py-2">
                                                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-xs">Ready</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                                <Button onClick={handleConfirmImport}>Import {parsedMembers.length} Members</Button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default ImportMemberModal;
