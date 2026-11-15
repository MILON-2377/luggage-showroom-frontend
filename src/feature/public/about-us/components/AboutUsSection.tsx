import AboutIntroduction, {
  type AboutIntroductionProps,
} from "./AboutIntroduction";

import CompanyStory, {
  type CompanyStoryProps,
} from "./CompanyStory";

import CompanyVerification, {
  type CompanyVerificationProps,
} from "./CompanyVerification";

import CompanyStatistics, {
  type CompanyStatisticsProps,
} from "./CompanyStatistics";

import CompanyMilestones, {
  type CompanyMilestonesProps,
} from "./CompanyMilestones";

import MarketsAndCustomers, {
  type MarketsAndCustomersProps,
} from "./MarketsAndCustomers";

import OurTeam, {
  type OurTeamProps,
} from "./OurTeam";

import FactoryOfficeGallery, {
  type FactoryOfficeGalleryProps,
} from "./FactoryOfficeGallery";

export interface AboutUsSectionProps {
  introduction: AboutIntroductionProps;
  story: CompanyStoryProps;
  verification: CompanyVerificationProps;
  statistics?: CompanyStatisticsProps;
  milestones: CompanyMilestonesProps;
  markets: MarketsAndCustomersProps;
  team?: OurTeamProps;
  gallery: FactoryOfficeGalleryProps;
}

export default function AboutUsSection({
  introduction,
  story,
  verification,
  statistics,
  milestones,
  markets,
  team,
  gallery,
}: AboutUsSectionProps) {
  return (
    <div className="w-full bg-background text-foreground">
      {/* 1. Company Introduction */}
      <AboutIntroduction {...introduction} />

      {/* 2. Company Story */}
      <CompanyStory {...story} />

      {/* 3. Company Verification */}
      <CompanyVerification {...verification} />

      {/* 4. Company Statistics */}
      {statistics && (
        <CompanyStatistics {...statistics} />
      )}

      {/* 5. Company Milestones */}
      <CompanyMilestones {...milestones} />

      {/* 6. Markets & Customers */}
      <MarketsAndCustomers {...markets} />

      {/* 7. Our Team */}
      {team && (
        <OurTeam {...team} />
      )}

      {/* 8. Factory & Office Gallery */}
      <FactoryOfficeGallery {...gallery} />
    </div>
  );
}