// Public booking flow — task A4. No auth on this route group.
export default async function BookPage({ params }: { params: Promise<{ salonSlug: string }> }) {
  const { salonSlug } = await params;
  return (
    <main className="mx-auto max-w-lg p-6">
      <h1 className="text-xl font-semibold">Book at {salonSlug}</h1>
      <p className="mt-2 text-sm text-neutral-500">Online booking is not live yet — task A4.</p>
    </main>
  );
}
