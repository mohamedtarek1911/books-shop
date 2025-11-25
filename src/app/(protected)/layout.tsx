import Navbar from "@/components/layout/Navbar";
import QueryProvider from "@/lib/query/QueryProvider";
import ToastProvider from "@/components/ui/ToastProvider";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <ToastProvider>
        <Navbar />
        <main>{children}</main>
      </ToastProvider>
    </QueryProvider>
  );
}
