'use client'

import { useState } from 'react';
import { signIn } from '../public/utils/firebase'; 
import { useAuth } from '../contexts/AuthContext'; 
import { useRouter } from 'next/navigation'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, loading } = useAuth(); 
  const router = useRouter(); 

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await signIn(email, password);
      router.push('/home'); 
    } 
    catch (error) 
    {
      console.error("Erro ao fazer login:", error);
      setError('Erro ao fazer login. Verifique suas credenciais.');
      router.push('/home');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Verificando autenticação...</div>;
  }

  if (user) {
    return null; 
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-slate-700">
      {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin} className="mb-6">
          <Card className="w-[350px]">
            <CardHeader className="space-y-1">
              <CardTitle className="pb-8 text-3xl">Login</CardTitle>
              <CardDescription>
                Enter your email and password to login
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required        
                />
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
              </div>
            </CardContent>
            <CardFooter class="flex items-center justify-center grid gap-1">
              <div>
                <Button className="w-full text-xl bg-blue-500 text-white p-2 rounded" type="submit">
                  Login
                </Button>
                <div className='p-5 text-sm'>
                  <p>Não tem uma conta? <a href="/register" className="text-blue-500">Registre-se</a></p>
                </div>
              </div>
            </CardFooter>
          </Card>
        </form>
    </div>
  );
}
