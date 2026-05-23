import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 flex justify-center">
      <SignIn />
    </div>
  );
}
