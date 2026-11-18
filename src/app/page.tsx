import CreateMobForm from "@/components/CreateMobForm";

export default function Home() {
  return (
    <>
      <h1>AI-DLC Bingo</h1>
      <p className="muted">Start a mob, share the link, and spot what AI-DLC does.</p>
      <CreateMobForm />
    </>
  );
}
