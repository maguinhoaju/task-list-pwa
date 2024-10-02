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

const Profile = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState({
    email: "informação não consta",
    name: "informação não consta",
    uid: "informação não consta",
  });
  const router = useRouter();

  const [photo, setPhoto] = useState("/placeholder.svg?height=128&width=128");

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else {
      const { displayName, email, uid } = user;
      setUserData({
        name: displayName || "informação não consta",
        email: email || "informação não consta",
        uid: uid || "informação não consta",
      });
    }
  }, [user, router]);

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

  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar as alterações
    console.log("Salvando alterações:", { name, photo });
  };

  return (
    <PrivateRoute>
      <div className="container mx-auto px-4 py-8">
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
                    value={userData.name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-lg py-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-lg">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    value={userData.email}
                    disabled
                    className="text-lg py-2"
                  />
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
