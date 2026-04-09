import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">
            Join BlesseOgoVIk Fab and explore premium Nigerian textiles
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-lg rounded-xl border-0",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "border border-gray-200 hover:bg-gray-50",
              formButtonPrimary:
                "bg-orange-500 hover:bg-orange-600 text-white",
              footerActionLink: "text-orange-500 hover:text-orange-600",
            },
          }}
        />
      </div>
    </div>
  );
}
