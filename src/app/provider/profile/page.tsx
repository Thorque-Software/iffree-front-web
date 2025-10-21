'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { getOneProvider,uploadProviderProfileImage,signOneMedia } from '@/services/ApiHandler';
import Swal from 'sweetalert2';
import { Provider } from '@/types/domain';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [providerId, setProviderId] = useState<string>("");
  const [user, setUser] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const fetchProfile = async (providerId: string) => {
    setLoading(true);
    try {
      const res = await getOneProvider(providerId);
      setUser(res);
      if(res.media) {
        const mediaSign = await signOneMedia(res.media);
        setPreviewUrl(mediaSign.mediaSign[0].url || "");
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser && authUser.providerId) {
      fetchProfile(authUser.providerId);
      setProviderId(authUser.providerId);
    }
  }, [authUser]);



  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;


    try {
      await uploadProviderProfileImage(providerId, selectedFile);
      Swal.fire('Éxito', 'Imagen de perfil actualizada.', 'success');
      setSelectedFile(null);
      setPreviewUrl("");
      fetchProfile(providerId);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Error al guardar la imagen.', 'error');
    }
  };

  if (loading) {
    return <div className="text-center p-6 text-gray-500">Cargando perfil...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-semibold mb-6">Mi perfil</h1>

      <div className="flex items-center mb-6">
        <div className="relative w-32 h-32 mr-6">
          <img
            src={previewUrl || '/no_image.jpg'}
            alt="Perfil"
            className="w-32 h-32 rounded-full object-cover border border-gray-300"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
            title="Cambiar imagen"
          />
        </div>
        <span className="text-sm text-gray-500">
          Hacé clic sobre la imagen para cambiarla
        </span>
      </div>

      {user && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nombre y apellido</label>
            <input
              value={user.fullname}
              disabled
              className="w-full bg-gray-100 rounded-md border border-gray-300 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">CUIL</label>
            <input
              value={user.cuil}
              disabled
              className="w-full bg-gray-100 rounded-md border border-gray-300 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Ciudad</label>
            <input
              value={user.city?.name || ''}
              disabled
              className="w-full bg-gray-100 rounded-md border border-gray-300 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Tipo</label>
            <input
              value={user.type === 'default' ? 'Normal' : 'Náutico'}
              disabled
              className="w-full bg-gray-100 rounded-md border border-gray-300 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              value={user.email}
              disabled
              className="w-full bg-gray-100 rounded-md border border-gray-300 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Teléfono</label>
            <input
              value={user.phoneNumber || 'N/A'}
              disabled
              className="w-full bg-gray-100 rounded-md border border-gray-300 p-2"
            />
          </div>
          <span className="text-sm text-gray-500 col-span-2">
            *{user.needConfirmation ? 'Requiere confirmación' : 'No requiere confirmación'} en las reservas
          </span>
        </div>
      )}

      {selectedFile && (
        <div className="mt-6">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Guardar nueva imagen
          </button>
        </div>
      )}
    </div>
  );
}
