export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <article className="max-w-2xl mx-auto px-4 py-10 prose-headings:display [&_h1]:text-3xl [&_h1]:text-espresso [&_h1]:mb-2 [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:text-espresso [&_p]:text-espresso/80 [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ul_li]:text-espresso/80 [&_a]:underline [&_a]:underline-offset-2 [&_a]:text-crema-2">
      {children}
    </article>
  );
}
