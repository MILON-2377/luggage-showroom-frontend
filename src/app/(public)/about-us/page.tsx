"use client";

import AboutUsSection from "@/src/feature/public/about-us/components/AboutUsSection";
import { useLanguage } from "@/src/providers";

const AboutUs = () => {
  const { t } = useLanguage();
  const content = t.aboutUs.pageContent;

  return (
    <AboutUsSection
      introduction={{
        companyName: content.companyName,
        establishmentYear: "2011",
        specialization: content.specialization,
        description: content.description,
        factoryLocation: content.factoryLocation,
        productFamilies: content.productFamilies,
        customerTypes: content.customerTypes,
      }}
      story={{
        introduction: content.story.introduction,
        establishmentReason: content.story.establishmentReason,
        businessDevelopment: content.story.businessDevelopment,
        productSpecialization: content.story.productSpecialization,
        internationalExperience: content.story.internationalExperience,
        imageAlt: content.story.imageAlt,
      }}
      verification={{
        legalCompanyName: content.companyName,
        factoryAddress: content.factoryLocation,
      }}
      statistics={{
        factoryFloorArea: "6,500 m²",
        workforce: "145",
        productionLines: content.productionLines,
      }}
      milestones={{
        milestones: [
          {
            year: "2011",
            title: content.foundingMilestone.title,
            description: content.foundingMilestone.description,
          },
        ],
      }}
      markets={{
        exportRegions: [],
        countries: [],
        customerTypes: content.customerTypes,
        brands: [],
      }}
      team={{
        members: [],
      }}
      gallery={{
        images: [],
      }}
    />
  );
};

export default AboutUs;