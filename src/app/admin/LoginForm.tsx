import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { config } from "@/lib/config";

export function LoginForm() {
  async function login(formData: FormData) {
    "use server";
    const pw = String(formData.get("password") ?? "");
    if (pw !== config.adminPassword) redirect("/admin?error=1");
    const c = await cookies();
    c.set("admin_auth", config.adminPassword, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    redirect("/admin");
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="display text-2xl text-espresso mb-4">Staff login</h1>
      <form action={login} className="space-y-3">
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full rounded-xl border border-espresso/20 bg-cream px-4 py-3 focus:outline-none focus:ring-2 focus:ring-crema"
        />
        <button className="w-full rounded-full bg-espresso text-cream py-3 font-medium hover:bg-espresso-2">
          Log in
        </button>
        <p className="text-xs text-espresso/60">
          Dev default: <code>letmein</code> (change ADMIN_PASSWORD in .env.local)
        </p>
      </form>
    </div>
  );
}
