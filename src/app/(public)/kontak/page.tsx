import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { schoolContact } from "@/lib/school";
export const metadata = { title: "Kontak sekolah" };
export default function KontakPage() {
  return (
    <section className="school-section py-16 sm:py-24">
      <div className="container-width max-w-5xl">
        <p className="eyebrow text-primary">SMA Widya Darma Surabaya</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
          Kontak Sekolah
        </h1>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-blue-100 bg-white p-7">
            <h2 className="text-xl font-semibold">Alamat &amp; Kontak</h2>
            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="font-semibold text-primary">Alamat</dt>
                <dd className="mt-2 leading-7 text-muted">
                  {schoolContact.address}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-primary">Email</dt>
                <dd className="mt-2 break-words">
                  <a
                    href={`mailto:${schoolContact.email}`}
                    className="text-muted hover:underline"
                  >
                    {schoolContact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-primary">WhatsApp</dt>
                <dd className="mt-2">
                  <a
                    href={schoolContact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:underline"
                  >
                    {schoolContact.whatsappDisplay}
                  </a>
                </dd>
              </div>
            </dl>
            <div className="mt-7">
              <WhatsAppButton />
            </div>
          </div>
          <div className="rounded-3xl border border-blue-100 bg-white p-7">
            <h2 className="text-xl font-semibold">Media Sosial</h2>
            <ul className="mt-6 space-y-5">
              {schoolContact.socialMedia.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-blue-100 p-4 transition hover:bg-blue-50"
                  >
                    <span className="block text-sm font-semibold text-primary">
                      {social.label}
                    </span>
                    <span className="mt-2 block break-words text-sm text-muted">
                      {social.account}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
