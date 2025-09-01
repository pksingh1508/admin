import { SignIn } from "@clerk/nextjs";
import { inter } from "@/fonts/fonts";

export default function SignInPage() {
  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-gray-900 ${inter.className}`}
    >
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Admin Panel
          </h1>
          <p className="text-gray-400 mt-2">Sign in to access the dashboard</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700",
              card: "shadow-xl bg-gray-800 border border-gray-700",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton:
                "bg-gray-700 hover:bg-gray-600 border-gray-600",
              socialButtonsBlockButtonText: "text-white",
              formFieldLabel: "text-gray-300",
              formFieldInput:
                "bg-gray-700 border-gray-600 text-white placeholder-gray-400",
              footerActionLink: "text-indigo-400 hover:text-indigo-300",
              dividerText: "text-gray-500",
              dividerLine: "bg-gray-700"
            }
          }}
        />
      </div>
    </div>
  );
}
