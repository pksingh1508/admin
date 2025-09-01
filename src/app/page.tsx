import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <h1>admin</h1>
    </div>
  );
}
