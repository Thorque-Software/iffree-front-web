import React from "react";
import ServiceCard from "@/components/ServiceCard";

const serviciosData = [
  {
    title: "Kayak",
    price: "$150 p/persona",
    provider: "Juan Pérez",
    description: "Alquiler de kayaks en el lago...",
    city: "Villa Traful",
    capacity: 20,
    minRequired: 2,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Sea_Kayak.JPG/1200px-Sea_Kayak.JPG",
  },
  {
    title: "Trekking",
    price: "$150",
    provider: "Pilar Corti",
    description: "Actividad física que consiste Actividad física que consiste Actividad física que consiste Actividad física que consiste",
    city: "Bariloche",
    capacity: 50,
    minRequired: 10,
    image: "https://www.bupasalud.com/sites/default/files/inline-images/trekking%20que%20es-2.jpg",
  },

 
  
  
];

const ServicesPage = () => {
  return (
    <div>
      <div className="flex  items-center mb-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded mr-4">+ Nuevo servicio</button>
        <input
          type="text"
          placeholder="Buscar"
          className="border rounded px-3 py-2 w-1/3"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        {serviciosData.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
