'use client';
import ProviderForm from '@/components/ProviderForm';
import { PostProvider } from '@/services/ApiHandler';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { ProviderData } from '@/services/ApiHandler';

export default function NewProviderPage() {
  const router = useRouter();

  const handleCreate = async (data: ProviderData) => {
    await PostProvider(data);
    Swal.fire({ icon: 'success', 
      title: 'Proveedor creado',
      showConfirmButton: false,
      timer: 1500 
    }).then(() => {
      router.push('/admin/providers');
    });
  };

  return <ProviderForm mode="create" onSubmit={handleCreate} />;
}
