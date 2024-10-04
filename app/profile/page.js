"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PrivateRoute from "@/components/PrivateRoute";
import Image from "next/image";
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
import { auth, db, UpdateProfile } from "@/public/utils/firebase";
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const [photo, setPhoto] = useState("/images/placeholder.jpg");

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          console.log('Profile.UserEffect')
          setUser(user);
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            setName(docSnap.data().name);
            setPhotoURL(docSnap.data().photoURL);
            setEmail(docSnap.data().email);
            console.log('Informações do usuário obtidas com sucesso.')
          }
        } else {
          setUser(null); // Reset user if not authenticated
          router.push("/");
        }
      });
      return () => unsubscribe();
    }, [router]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (event) => {
    try {
      await UpdateProfile(user, name, photo);
      router.push('/home'); 
    } 
    catch (error) 
    {
      console.error("Erro ao atualizar o perfil do usuário:", error);
      setError('Erro ao atualizar o perfil do usuário.');
      router.push('/home');
    }
  };

  return (
    <PrivateRoute>
      <div className="flex items-center justify-start min-h-screen bg-gray-100 text-slate-700 px-4 py-8">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center mb-10">
              Perfil do Usuário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex flex-col items-center space-y-6 md:w-2/5">
                <Image
                  src={photo}
                  alt="Foto do perfil"
                  width={250}
                  height={250}
                  className="rounded-full"
                />
                <Label
                  htmlFor="photo-upload"
                  className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                >
                  Alterar foto
                </Label>
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
              <div className="w-full md:w-3/5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-lg">
                    Nome
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
                    E-mail:
                  </Label>
                  <p>{email}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center p-8">
            <Button
              onClick={handleSave}
              className="w-1/2 text-lg py-2 bg-blue-600 text-white"
            >
              Salvar Alterações
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PrivateRoute>
  );
};

export default Profile;
