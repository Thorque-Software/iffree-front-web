'use client';

import React, { useState } from 'react';

const NewProvider = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    ciudad: '',
    email: '',
    contacto: '',
    cuil: '',
    tipo: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nuevo proveedor:', formData);
    // acá podrías llamar a tu API
  };

  return (
    <div className="min-h-screen flex items-top justify-center">
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-lg w-full max-w-md"
      >
        <h1 className="text-4xl font-bold mb-6">Nuevo proveedor</h1>

        <label className="block font-medium mb-1">Nombre y apellido</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full bg-white rounded-md border border-gray-300 p-2 mb-2"
        />

        <label className="block font-medium mb-1">Ciudad</label>
        <input
          type="text"
          name="ciudad"
          value={formData.ciudad}
          onChange={handleChange}
          className="w-full bg-white rounded-md border border-gray-300 p-2 mb-2"
        />

        <label className="block font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full bg-white rounded-md border border-gray-300 p-2 mb-2"
        />

        <label className="block font-medium mb-1">Contacto</label>
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
        />

        <label className="block font-medium mb-1">Tipo</label>
        <select
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          className="w-full bg-white rounded-md border border-gray-300 p-2 mb-2"
        >
          <option value="">Seleccionar</option>
          <option value="Normal">Normal</option>
          <option value="Náutico">Náutico</option>
        </select>

        <label className="block font-medium mb-1">Contraseña</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full bg-white rounded-md border border-gray-300 p-2 mb-2"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md mt-4 hover:bg-blue-700 transition"
        >
          Aceptar
        </button>
      </form>
    </div>
  );
};

export default NewProvider;
