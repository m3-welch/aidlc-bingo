import MobView from "@/components/MobView";

export default async function MobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MobView mobId={id} />;
}
