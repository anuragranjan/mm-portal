import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { X, Upload, FileText, Check, AlertCircle, Loader2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source - handling Vite public path
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

const ImportMemberModal = ({ isOpen, onClose, onImport }) => {
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [parsedMembers, setParsedMembers] = useState([]);
    const [error, setError] = useState('');
    const [step, setStep] = useState('upload'); // upload, preview

    if (!isOpen) return null;

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError('');
            processPDF(selectedFile);
        } else {
            setError('Please select a valid PDF file.');
        }
    };

    const processPDF = async (pdfFile) => {
        setIsProcessing(true);
        setParsedMembers([]);
        try {
            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            let allText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();

                const items = textContent.items.sort((a, b) => {
                    if (Math.abs(a.transform[5] - b.transform[5]) > 5) {
                        return b.transform[5] - a.transform[5];
                    }
                    return a.transform[4] - b.transform[4];
                });

                items.forEach(item => {
                    allText += item.str + ' ';
                });
                allText += '\n'; // Separate pages
            }

            const extractedMembers = parseExtractedText(allText);

            if (extractedMembers.length === 0) {
                setError('Could not identify any member records in the PDF. Please check the format.');
            } else {
                setParsedMembers(extractedMembers);
                setStep('preview');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to process PDF. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const parseExtractedText = (text) => {
        const members = [];
        const normalizedText = text.replace(/\s+/g, ' ');

        // Heuristic: Look for blocks starting with "1. Patron" or similar
        const blockRegex = /(\d+\.\s*(?:Patron|Life Member|Member))(.*?)(?=(\d+\.\s*(?:Patron|Life Member|Member)|$))/gi;

        let match;
        while ((match = blockRegex.exec(normalizedText)) !== null) {
            const block = match[0];
            const member = extractDetailsFromBlock(block);
            if (member.name) {
                members.push(member);
            }
        }

        return members;
    };

    const extractDetailsFromBlock = (block) => {
        const member = {
            name: '', email: '', phone: '', address: '', pan: '',
            status: 'Active', role: 'Member', plan: 'Basic'
        };

        const emailMatch = block.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i);
        if (emailMatch) member.email = emailMatch[0];

        const phoneMatch = block.match(/(?:Mob\.?|Mobile)\s*[:.]?\s*(\+?\d[\d\s-]{8,})/i);
        if (phoneMatch) member.phone = phoneMatch[1].trim();

        if (block.toLowerCase().includes('patron')) {
            member.role = 'Patron';
            member.plan = 'Premium';
        }

        let cleanBlock = block.replace(/^\d+\.\s*(Patron|Life Member|Member)/i, '').trim();
        const words = cleanBlock.split(' ').filter(w => w.length > 0);

        if (words.length > 0) {
            let nameEndIndex = words.findIndex(w => /\d/.test(w));
            if (nameEndIndex === -1) nameEndIndex = 2; // Default to 2 words if no number found
            if (nameEndIndex < 2) nameEndIndex = 2;    // Ensure at least 2 words if number is very early

            member.name = words.slice(0, nameEndIndex).join(' ');

            let addressPart = words.slice(nameEndIndex).join(' ');
            if (member.email) addressPart = addressPart.replace(member.email, '');
            if (member.phone) addressPart = addressPart.replace(member.phone, '');

            member.address = addressPart.replace(/\s+/g, ' ').trim().slice(0, 100);
        }

        return member;
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
            <Card className="w-full max-w-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Import Members from PDF</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {step === 'upload' ? (
                        <div className="text-center space-y-6">
                            <div
                                className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
                                onClick={() => document.getElementById('pdf-upload').click()}
                            >
                                {isProcessing ? (
                                    <Loader2 size={48} className="text-primary-500 animate-spin mb-4" />
                                ) : (
                                    <Upload size={48} className="text-slate-400 mb-4" />
                                )}
                                <h3 className="text-lg font-medium text-slate-900">
                                    {isProcessing ? 'Processing PDF...' : 'Click to upload PDF'}
                                </h3>
                                <input id="pdf-upload" type="file" accept=".pdf" className="hidden"
                                    onChange={handleFileChange} disabled={isProcessing}
                                />
                            </div>
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm justify-center">
                                    <AlertCircle size={16} />{error}
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
                                        <tr><th className="px-4 py-2">Name</th><th className="px-4 py-2">Email</th><th className="px-4 py-2">Phone</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {parsedMembers.map((m, i) => (
                                            <tr key={i}>
                                                <td className="px-4 py-2 font-medium">{m.name}</td><td className="px-4 py-2">{m.email}</td><td className="px-4 py-2">{m.phone}</td>
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
