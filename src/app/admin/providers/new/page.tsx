'use client';

import React, { useState,useEffect } from 'react';
import { getCities,PostProvider, ProviderData} from '@/services/ApiHandler';
import { City } from '@/types/domain';

const NewProvider = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    ciudad: '',
    email: '',
    contacto: '',
    cuil: '',
    tipo: '',
    confirmar: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cities, setCities] = useState<City[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, type, value } = target;
    const checked = (target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
 

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await getCities();
        setCities(data.items);
      } catch (err) {
        setError('Error al cargar las ciudades');
      }
    };
    fetchCities();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Mapear los campos del form a lo que espera la API
    const data: ProviderData = {
      fullname: formData.nombre,
      email: formData.email,
      phoneNumber: formData.contacto || undefined,
      cuil: formData.cuil,
      cityId: parseInt(formData.ciudad, 10) || 0, // si tu ciudad es un ID numérico
      type: formData.tipo !== 'boat' ? 'default' : 'boat', // ajustar según tu lógica
      needConfirmation: formData.confirmar, // puedes cambiar según necesites
    };

    try {
      await PostProvider(data);
      setSuccess(true);
      setFormData({
        nombre: '',
        ciudad: '',
        email: '',
        contacto: '',
        cuil: '',
        tipo: '',
        confirmar: false,
      });
    } catch (err: any) {
      setError(err.message || 'Error al crear el proveedor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-top justify-center">
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-lg w-full max-w-md"
      >
        <h1 className="text-4xl font-bold mb-6">Nuevo proveedor</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">Proveedor creado con éxito</p>}

        <label className="block font-medium mb-1">Nombre y apellido</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
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

        <label className="block font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full bg-white rounded-md border border-gray-300 p-2 mb-2"
          required
        />

        <label className="block font-medium mb-1">Telefono</label>
        <input
          type="text"
          name="contacto"
          value={formData.contacto}
          onChange={handleChange}
          className="w-full bg-white rounded-md border border-gray-300 p-2 mb-2"
        />

        <label className="block font-medium mb-1">CUIL</label>
        <input
          type="text"
          name="cuil"
          value={formData.cuil}
          onChange={handleChange}
          className="w-full bg-white rounded-md border border-gray-300 p-2 mb-2"
          required
        />

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

        <label className="block font-medium mb-1">Necesita confirmación?</label>
        <input
          type="checkbox"
          name="confirmar"
          checked={formData.confirmar}
          onChange={handleChange}
          className="mr-2"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md mt-4 text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} transition`}
        >
          {loading ? 'Creando...' : 'Aceptar'}
        </button>
      </form>
    </div>
  );
};

export default NewProvider;
