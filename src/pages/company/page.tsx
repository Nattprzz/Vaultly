import { useParams } from 'react-router-dom';

import Sidebar        from '@/components/feature/Sidebar';
import SeoHead        from '@/components/feature/SeoHead';
import { useGameCompany } from '@/hooks/useGameCompany';

import CompanyHero            from './components/CompanyHero';
import CompanyLoadingState    from './components/CompanyLoadingState';
import CompanyErrorState      from './components/CompanyErrorState';
import CompanyPopularGames    from './components/CompanyPopularGames';
import CompanyStatsGrid       from './components/CompanyStatsGrid';
import CompanyFranchises      from './components/CompanyFranchises';
import CompanyDescription     from './components/CompanyDescription';
import CompanyTimeline        from './components/CompanyTimeline';
import RelatedCompanies       from './components/RelatedCompanies';
import CompanyLinks           from './components/CompanyLinks';
import CompanyGenresPlatforms from './components/CompanyGenresPlatforms';
import CompanySidebarInfo     from './components/CompanySidebarInfo';

export default function CompanyPage() {
  const { slug } = useParams<{ slug: string }>();
  const { company, loading, error } = useGameCompany(slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <Sidebar />
        <div className="pt-14 md:pt-0 md:pl-64"><CompanyLoadingState /></div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <SeoHead
          title="Compañía no encontrada | Vaultly"
          description="No hemos encontrado esta compañía en Vaultly."
          canonical={`/company/${slug ?? ''}`}
        />
        <Sidebar />
        <CompanyErrorState error={error} />
      </div>
    );
  }

  const description = company.description_es || company.description || null;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <SeoHead
        title={`${company.name} | Vaultly`}
        description={description ? description.slice(0, 155) : `${company.name} en Vaultly.`}
        keywords={`${company.name}, videojuegos, compañía, desarrolladora, publisher, Vaultly`}
        canonical={`/company/${company.slug}`}
        ogImage={company.logo_url ?? undefined}
      />
      <Sidebar />

      <div className="pt-14 md:pt-0 md:pl-64">
        <CompanyHero company={company} />

        <main className="mx-auto max-w-screen-xl px-4 py-8 md:px-6 md:py-10 space-y-10">
          <CompanyPopularGames games={company.popular_games} />
          <CompanyStatsGrid    company={company} />
          <CompanyFranchises   games={company.popular_games} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-6">
              <CompanyDescription description={description} />
              <CompanyTimeline    company={company} />
              <RelatedCompanies   companies={company.related_companies} />
            </div>

            <aside className="space-y-4">
              <CompanySidebarInfo     company={company} />
              <CompanyLinks           links={company.links} />
              <CompanyGenresPlatforms platforms={company.platforms} genres={company.genres} />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
