import React from "react";

interface ServiceCardProps {
  title: string;
  price: string;
  provider: string;
  description: string;
  city: string;
  capacity: number;
  minRequired: number;
  image: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  price,
  provider,
  description,
  city,
  capacity,
  minRequired,
  image,
}) => {
  return (
    <div className="border border-gray-200 p-4 rounded shadow-md max-w-xs flex flex-col justify-between h-full">
      <div>
        <img src={image} alt={title} className="w-full h-48 object-cover rounded" />
        <h3 className="text-lg font-semibold mt-2">{title}</h3>
        <p className="text-gray-700">{price}</p>
        <p className="text-sm text-gray-500">
          Proveedor: {provider} <br />
          Descripción: {description.length > 100 ? description.slice(0, 100) + "..." : description} <br />
          Ciudad: {city} <br />
          Cupo: {capacity} <br />
          Mínimo requerido: {minRequired}
        </p>
      </div>

      <div className="flex gap-2 mt-4">
        <button className="bg-gray-800 text-white px-2 py-1 rounded">Turnos</button>
        <button className="border px-2 py-1 rounded">Gestionar</button>
        <button className="bg-red-600 text-white px-2 py-1 rounded">Borrar</button>
      </div>
    </div>
  );
};

export default ServiceCard;
