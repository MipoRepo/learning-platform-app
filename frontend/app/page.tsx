// Tämä on vaiheen F0 väliaikainen etusivu. Sivu todistaa, että Next.js,
// TypeScript ja Tailwind CSS toimivat yhdessä. Varsinainen kurssikirjasto
// rakennetaan vaiheessa F2.
export default function HomePage() {
    return (
        <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-4 px-6 py-16">
            <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
                Vaihe F0
            </p>
            <h1 className="text-3xl font-bold text-slate-900">
                Frontendin runko toimii
            </h1>
            <p className="text-base leading-relaxed text-slate-600">
                Next.js, TypeScript ja Tailwind CSS on asennettu. Seuraavassa
                vaiheessa rakennetaan design system, yläpalkki ja
                teemanvaihto.
            </p>
        </main>
    );
}
