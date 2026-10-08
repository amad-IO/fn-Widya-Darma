import PageHeader from "@/components/shared/PageHeader";
import { ContactSection } from "@/components/sections/SchoolSections";
export const metadata = { title: "Kontak sekolah" };
export default function KontakPage() {
  return (
    <>
      <PageHeader title="Lorem ipsum dolor" label="Kontak sekolah" />
      <ContactSection page />
    </>
  );
}
