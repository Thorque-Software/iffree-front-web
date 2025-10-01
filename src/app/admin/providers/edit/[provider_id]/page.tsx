'use client';
import React, { useEffect, useState } from 'react';
import { getOneProvider, PutProvider } from '@/services/ApiHandler';
import ProviderForm from '@/components/ProviderForm';
import { useRouter } from 'next/navigation';
import { Provider } from '@/types/domain';
import { ProviderData } from '@/services/ApiHandler';
import Swal from 'sweetalert2';

interface EditProviderPageProps {
  params: Promise<{ provider_id: string }>;
}

export default function EditProviderPage({ params }: EditProviderPageProps) {
  const { provider_id: id } = React.use(params);
  const [data, setData] = useState<Provider | null>(null);
  const router = useRouter();

  useEffect(() => {
    getOneProvider(id).then(setData);
  }, [id]);

  const handleUpdate = async (values: ProviderData) => {
    await PutProvider(id, values);
    Swal.fire({ icon: 'success', 
      title: 'Proveedor actualizado',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      router.push('/admin/providers');
    });
  };

  if (!data) return <p>Cargando...</p>;

  return <ProviderForm mode="edit" initialData={data} onSubmit={handleUpdate} />;
}
