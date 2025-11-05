import ReservationTable from '@/components/ReservationTable';

export default function Page({ searchParams }: { searchParams: { shiftId?: string } }) {
  const shiftId = searchParams?.shiftId ?? undefined;

  return (
    <div className="p-6">
      <ReservationTable shiftId={shiftId} />
    </div>
  );
}
