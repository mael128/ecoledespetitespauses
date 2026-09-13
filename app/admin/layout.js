import AdminProviders from "./providers";

export const metadata = {
  title: "Admin — L'École des Petites Pauses",
};

export default function AdminLayout({ children }) {
  return <AdminProviders>{children}</AdminProviders>;
}
