import { useParams, Link } from 'react-router-dom';
import Sidebar from '@/components/feature/Sidebar';
import SeoHead from '@/components/feature/SeoHead';
import PersonHero from './components/PersonHero';
import PersonBio from './components/PersonBio';
import PersonWorks from './components/PersonWorks';
import PersonStats from './components/PersonStats';
import { PEOPLE_MOCK } from '@/mocks/people';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { getSiteUrl } from '@/lib/site';

export default function PersonPage() {
  const { id = '' } = useParams<{ id: string }>();
  const person = PEOPLE_MOCK[id];

  // Scroll reveal refs
  const bioRef = useScrollReveal<HTMLDivElement>();
  const worksRef = useScrollReveal<HTMLDivElement>({ rootMargin: '0px 0px -40px 0px' });
  const statsRef = useScrollReveal<HTMLDivElement>({ rootMargin: '0px' });

  if (!person) {
    return (
      <div className="min-h-screen bg-[var(--surface)] dark:bg-[var(--bg)] flex flex-col">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-400 pt-14 md:pt-0 md:pl-64">
          <i className="ri-user-unfollow-line text-5xl"></i>
          <p className="text-lg font-semibold">Persona no encontrada</p>
          <Link to="/catalog" className="text-sm text-brand dark:text-brand-dark hover:underline cursor-pointer">
            Volver a Explorar
          </Link>
        </div>
      </div>
    );
  }

  const avgRating =
    person.works.length > 0
      ? (person.works.reduce((s, w) => s + w.rating, 0) / person.works.length).toFixed(1)
      : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    image: person.photo,
    description: person.bio,
    nationality: person.nationality,
    birthDate: String(person.birthYear),
    jobTitle: person.role,
    url: `${getSiteUrl()}/person/${person.id}`,
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] dark:bg-[var(--bg)]">
      <SeoHead
        title={`${person.name} — ${person.role} | Vaultly`}
        description={`${person.name} es ${person.role.toLowerCase()} ${person.nationality.toLowerCase()}. Conocido/a por: ${person.known_for.join(', ')}. ${person.works.length} obras${avgRating ? ` con una media de ${avgRating}` : ''}.`}
        keywords={`${person.name}, ${person.role}, ${person.known_for.join(', ')}, Vaultly`}
        canonical={`/person/${person.id}`}
        ogImage={person.photo}
        jsonLd={jsonLd}
      />
      <Sidebar />

      <div className="pt-14 md:pt-0 md:pl-64">
        {/* Hero — has its own internal reveal */}
        <PersonHero person={person} />

        {/* Main content */}
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-10">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Left: bio + works */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">
              <div ref={bioRef} className="sr-item">
                <PersonBio person={person} />
              </div>
              <div ref={worksRef} className="sr-item">
                <PersonWorks person={person} />
              </div>
            </div>

            {/* Right: stats sidebar */}
            <div
              ref={statsRef}
              className="sr-item-right w-full lg:w-72 flex-shrink-0"
            >
              <div className="sticky top-24">
                <PersonStats person={person} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
