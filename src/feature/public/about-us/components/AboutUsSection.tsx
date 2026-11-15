import AboutIntroduction, { type AboutIntroductionProps } from "./AboutIntroduction";
import CompanyStory, { type CompanyStoryProps } from "./CompanyStory";
import CompanyVerification, { type CompanyVerificationProps } from "./CompanyVerification";
import CompanyStatistics, { type CompanyStatisticsProps } from "./CompanyStatistics";
import CompanyMilestones, { type CompanyMilestonesProps } from "./CompanyMilestones";
import MarketsAndCustomers, { type MarketsAndCustomersProps } from "./MarketsAndCustomers";
import OurTeam, { type OurTeamProps } from "./OurTeam";
import FactoryOfficeGallery, { type FactoryOfficeGalleryProps } from "./FactoryOfficeGallery";
import CompanyPurpose from "./CompanyPurpose";

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

export default function AboutUsSection({ introduction, story, verification, statistics, milestones, markets, team, gallery }: AboutUsSectionProps) {
  return (
    <div className="w-full bg-background text-foreground">
      <AboutIntroduction {...introduction} />
      <CompanyStory {...story} />
      <CompanyPurpose />
      <CompanyVerification {...verification} />
      {statistics && <CompanyStatistics {...statistics} />}
      <CompanyMilestones {...milestones} />
      <MarketsAndCustomers {...markets} />
      {team && <OurTeam {...team} />}
      <FactoryOfficeGallery {...gallery} />
    </div>
  );
}
