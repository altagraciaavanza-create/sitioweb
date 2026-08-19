import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Ingresar · Panel admin",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-subtle px-6">
      <div className="w-full max-w-sm rounded-lg border border-border bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-fg">Alta Gracia Avanza</h1>
        <p className="mt-1 text-sm text-fg-muted">Panel de administración</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
