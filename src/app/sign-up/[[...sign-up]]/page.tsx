import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 flex justify-center">
      <SignUp />
    </div>
  );
}
