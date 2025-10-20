export default function NotFound() {
  return (
    <div className="bg-white flex h-screen flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <img src="/iffree_logo_entero.png" alt="IFFREE Logo" className="w-auto h-auto mx-auto mb-4" />
      <p className="mt-2 text-lg">Ups... esta página no existe o no tenés permiso para acceder.</p>
      <a href="/" className="mt-4 text-blue-500 hover:underline">Volver al inicio</a>
    </div>
  )
}