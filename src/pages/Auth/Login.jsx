import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock login
        console.log('Logging in', { email, password });
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
            <Card className="w-full max-w-md p-8 shadow-xl border-t-4 border-primary-500">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">MM Portal</h1>
                    <p className="text-slate-500 mt-2">Sign in to manage memberships</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        id="email"
                        label="Email Address"
                        type="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" className="w-full" size="lg">
                        Sign In
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                        Forgot password?
                    </a>
                </div>
            </Card>
        </div>
    );
};

export default Login;
