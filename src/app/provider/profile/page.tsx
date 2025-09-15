'use client'
import { useState } from 'react'

export default function ProfilePage() {
  const [edit, setEdit] = useState(false)

  const user = {
    name: 'Juan Pérez',
    cuil: '286987412356',
    city: 'Bariloche',
    type: 'Normal',
    email: 'juanperez1980@gmail.com',
    phone: '3548123698',
    cbu: '021365849897741235648',
    alias: 'juan.perez.mp',
    avatar: 'https://i.pravatar.cc/150?img=3'
  }

  return (
    <div className="bg-white rounded-2xl shadow p-8 max-w-3xl">
      <h2 className="text-2xl font-semibold mb-6">{edit ? 'Editar perfil' : 'Mi perfil'}</h2>

      <div className="flex items-center gap-6 mb-6">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-24 h-24 rounded-full object-cover"
        />
        {edit && <button className="px-3 py-1 border rounded">Editar imagen</button>}
      </div>

      <form className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium">Nombre y apellido</label>
          <input type="text" defaultValue={user.name} disabled={!edit} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium">CUIL</label>
          <input type="text" defaultValue={user.cuil} disabled className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium">Ciudad</label>
          <input type="text" defaultValue={user.city} disabled={!edit} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium">Tipo</label>
          <input type="text" defaultValue={user.type} disabled className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" defaultValue={user.email} disabled={!edit} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium">Teléfono</label>
          <input type="text" defaultValue={user.phone} disabled={!edit} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium">CBU/CVU</label>
          <input type="text" defaultValue={user.cbu} disabled={!edit} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium">Alias</label>
          <input type="text" defaultValue={user.alias} disabled={!edit} className="input" />
        </div>
      </form>

      <div className="mt-6">
        {edit ? (
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => setEdit(false)}
          >
            Confirmar cambios
          </button>
        ) : (
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => setEdit(true)}
          >
            Editar mi perfil
          </button>
        )}
      </div>
    </div>
  )
}