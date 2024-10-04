"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "../../public/utils/firebase";
import { logEvent } from 'firebase/analytics';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      const user = await signUp(email, password, name);
      console.log("Usuário registrado com sucesso:", user);
      logEvent(analytics, 'sign_up', {
        page_title: 'register',
        user_id: user.id,
      });
      router.push("/home");
    } catch (error) {
      setError("Erro ao registrar o usuário: " + error.message);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordMatch(value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatch(value === password);
  };

  return (
    <form onSubmit={handleRegister}>
    <div className="flex items-center justify-start min-h-screen bg-gray-100 text-slate-700 px-4 py-8">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center mb-10">
              Cadastrar novo usuário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="w-full md:w-3/5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-lg">
                    Nome*
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-lg py-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-lg">
                    E-mail*
                  </Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-lg py-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-lg">
                    Senha*
                  </Label>
                  <Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="text-lg py-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-lg">
                    Confirmar Senha*
                  </Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="text-lg py-2"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center p-8">
            <button
              type="submit"
              className={`bg-blue-500 text-white p-2 rounded ${
                passwordMatch ? "" : "opacity-50 cursor-not-allowed"
              }`}
              disabled={!passwordMatch}
            >
              Registrar
            </button>
          </CardFooter>
        </Card>
    </div>
    </form>

    // <div className='min-h-screen p-6'>
    //   <h1 className='text-3xl mb-6'>Registrar</h1>
    //   <form onSubmit={handleRegister} className='space-y-4'>
    //     <input
    //       type='text'
    //       placeholder='Nome'
    //       className='border p-2 w-full'
    //       value={name}
    //       onChange={(e) => setName(e.target.value)}
    //       required
    //     />
    //     <input
    //       type='email'
    //       placeholder='Email'
    //       className='border p-2 w-full'
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //       required
    //     />
    //     <input
    //       type='password'
    //       placeholder='Senha'
    //       className={`border p-2 w-full ${passwordMatch ? 'border-green-500' : 'border-red-500'}`}
    //       value={password}
    //       onChange={handlePasswordChange}
    //       required
    //     />
    //     <input
    //       type='password'
    //       placeholder='Confirme a Senha'
    //       className={`border p-2 w-full ${passwordMatch ? 'border-green-500' : 'border-red-500'}`}
    //       value={confirmPassword}
    //       onChange={handleConfirmPasswordChange}
    //       required
    //     />
    //     <button
    //       type='submit'
    //       className={`bg-blue-500 text-white p-2 rounded ${passwordMatch ? '' : 'opacity-50 cursor-not-allowed'}`}
    //       disabled={!passwordMatch}
    //     >
    //       Registrar
    //     </button>
    //   </form>
    //   {error && <p className='text-red-500 mt-4'>{error}</p>}
    // </div>
  );
};

export default Register;
