'use client';

import React, { useState, useEffect, ChangeEvent} from 'react';
import { getProviderSelf } from '@/services/ApiHandler';

interface UserProfile {
  nombre: string;
  cuil: string;
  ciudad: string;
  tipo: string;
  email: string;
  telefono: string;
  cbu: string;
  alias: string;
  imagenUrl: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile>({
    nombre: 'Juan Pérez',
    cuil: '286987412356',
    ciudad: 'Bariloche',
    tipo: 'Normal',
    email: 'juanperez1980@gmail.com',
    telefono: '3548123698',
    cbu: '021365849897741235648',
    alias: 'juan.perez.mp',
    imagenUrl: '/no_image.jpg', // imagen local de ejemplo
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await getProviderSelf();
        console.log(res);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
     finally {
      setLoading(false);
    }
    };
    
    fetchProfile();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUser((prev) => ({
        ...prev,
        imagenUrl: URL.createObjectURL(e.target.files![0]),
      }));
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append('imagen', selectedFile);
    }

    try {
      await fetch('/api/perfil', {
        method: 'POST',
        body: formData,
      });
      alert('Perfil guardado!');
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert('Error al guardar perfil.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-semibold mb-6">Mi perfil</h1>

      <div className="flex items-center mb-6">
        <div className="relative w-32 h-32 mr-6">
          <img
            src={user.imagenUrl}
            alt="Perfil"
            className="w-32 h-32 rounded-full object-cover"
          />
          {editMode && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute flex bottom-0 left-0 w-full opacity-0 cursor-pointer"
            />
          )}
        </div>
        {editMode && <span className="text-sm text-gray-500">Click sobre la imagen para cambiar</span>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Nombre y apellido</label>
          <input
            name="nombre"
            value={user.nombre}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full bg-white rounded-md border border-gray-300 p-2 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">CUIL</label>
          <input
            name="cuil"
            value={user.cuil}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full bg-white rounded-md border border-gray-300 p-2 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Ciudad</label>
          <input
            name="ciudad"
            value={user.ciudad}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full bg-white rounded-md border border-gray-300 p-2 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Tipo</label>
          <input
            name="tipo"
            value={user.tipo}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full bg-white rounded-md border border-gray-300 p-2 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            name="email"
            value={user.email}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full bg-white rounded-md border border-gray-300 p-2 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Teléfono</label>
          <input
            name="telefono"
            value={user.telefono}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full bg-white rounded-md border border-gray-300 p-2 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">CBU/CVU</label>
          <input
            name="cbu"
            value={user.cbu}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full bg-white rounded-md border border-gray-300 p-2 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Alias</label>
          <input
            name="alias"
            value={user.alias}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full bg-white rounded-md border border-gray-300 p-2 disabled:bg-gray-100"
          />
        </div>
      </div>

      <div className="mt-6">
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Editar mi perfil
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Guardar cambios
          </button>
        )}
      </div>
    </div>
  );
}
