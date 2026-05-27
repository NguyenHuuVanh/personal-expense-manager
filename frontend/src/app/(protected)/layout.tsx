import { ProtectedLayout } from "@/components/auth/protected-layout";

export default function ProtectedRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
