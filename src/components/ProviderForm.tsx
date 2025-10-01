'use client';
import React, { useState, useEffect } from 'react';
import { getCities } from '@/services/ApiHandler';
import { City, Provider } from '@/types/domain';
import {ProviderData} from '@/services/ApiHandler';


interface ProviderFormProps {
  mode: 'create' | 'edit';
  initialData?: Provider;
  onSubmit: (formValues: ProviderData) => Promise<void>;
}


const ProviderForm = ({ mode, initialData, onSubmit }: ProviderFormProps) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: initialData?.fullname || '',
    ciudad: initialData?.cityId?.toString() || '',
    email: initialData?.email || '',
    contacto: initialData?.phoneNumber || '',
    cuil: initialData?.cuil || '',
    tipo: initialData?.type || '',
    confirmar: initialData?.needConfirmation || false,
  });

  useEffect(() => {
    getCities().then(data => setCities(data.items));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    setFormData(prev => ({
      ...prev,
      [target.name]: target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await onSubmit({
      fullname: formData.nombre,
      email: formData.email,
      phoneNumber: formData.contacto || undefined,
      cuil: formData.cuil,
      cityId: parseInt(formData.ciudad, 10),
      type: formData.tipo === "boat" ? "boat" : "default",
      needConfirmation: formData.confirmar,
    });

    setLoading(false);
  };

  return (
   <div className="min-h-screen flex items-top justify-center">
    <form onSubmit={handleSubmit} className="p-6 rounded-lg w-full max-w-md">
      <h1 className="text-4xl font-bold mb-6">
        {mode === 'create' ? 'Nuevo proveedor' : 'Editar proveedor'}
      </h1>

      <label className="block font-medium mb-1">Nombre y apellido</label>
      <input
        type="text"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        placeholder="Nombre"
        className="w-full bg-white rounded-md border border-gray-300 p-2 mb-2"
        required
      />

      <label className="block font-medium mb-1">Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full bg-white rounded-md border border-gray-300 p-2 mb-2"
        required
      />

      <label className="block font-medium mb-1">Teléfono</label>
      <input
        type="text"
        name="contacto"
        value={formData.contacto}
        onChange={handleChange}
        placeholder="Teléfono"
        className="w-full bg-white rounded-md border border-gray-300 p-2 mb-2"
      />

      <label className="block font-medium mb-1">CUIL</label>
      <input
        type="text"
        name="cuil"
        value={formData.cuil}
        onChange={handleChange}
        placeholder="CUIL"
        className="w-full bg-white rounded-md border border-gray-300 p-2 mb-2"
        required
      />

      <label className="block font-medium mb-1">Ciudad</label>
      <select
        name="ciudad"
        value={formData.ciudad}
        onChange={handleChange}
        className="w-full bg-white rounded-md border border-gray-300 p-2 mb-2"
        required
      >
        <option value="">Seleccionar ciudad</option>
        {cities.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>

      <label className="block font-medium mb-1">Tipo</label>
      <select
        name="tipo"
        value={formData.tipo}
        onChange={handleChange}
        className="w-full bg-white rounded-md border border-gray-300 p-2 mb-2"
        required
      >
        <option value="">Seleccionar</option>
        <option value="default">Normal</option>
        <option value="boat">Náutico</option>
      </select>

      <label className="block font-medium mb-1 flex items-center">
        <input
          type="checkbox"
          name="confirmar"
          checked={formData.confirmar}
          onChange={handleChange}
          className="mr-2"
        />
        Necesita confirmación?
      </label>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-md mt-4 text-white ${
          loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        } transition`}
      >
        {loading ? (mode === 'create' ? 'Creando...' : 'Guardando...') : 'Aceptar'}
      </button>
    </form>
  </div>
  );
};

export default ProviderForm;
