"use client";

import AboutUsSection from "@/src/feature/public/about-us/components/AboutUsSection";
import { useLanguage } from "@/src/providers";

const AboutUs = () => {
  const { locale } = useLanguage();
  const isChinese = locale === "zh";

  const companyName = isChinese
    ? "义乌市初橙箱包有限公司"
    : "Yiwu Chucheng Bags Co., Ltd.";

  const customerTypes = isChinese
    ? ["进口商", "批发商", "零售商", "电商卖家", "自有品牌客户"]
    : [
        "Importers",
        "Wholesalers",
        "Retailers",
        "E-commerce Sellers",
        "Private Label Brands",
      ];

  return (
    <AboutUsSection
      introduction={{
        companyName,
        establishmentYear: "2011",
        specialization: isChinese
          ? "专注于 EVA 箱包及多用途收纳包的定制生产。"
          : "Custom manufacturing of EVA cases, bags, and multipurpose organizers.",
        description: isChinese
          ? "我们拥有145名员工、6,500平方米的工厂、8条常规生产线及4条备用生产线，为客户提供从材料选择、样品开发到批量生产的定制服务。"
          : "With 145 employees, a 6,500 m² factory, 8 regular production lines, and 4 reserve lines, we provide custom manufacturing services from material selection and sample development to bulk production.",
        factoryLocation: isChinese
          ? "江西省上饶市玉山县南山乡港口村叶家"
          : "Yejia, Gangkou Village, Nanshan Township, Yushan County, Shangrao, Jiangxi, China",
        productFamilies: isChinese
          ? [
              "EVA 收纳包",
              "笔袋",
              "急救包",
              "洗漱包",
              "内衣收纳包",
              "电子产品收纳包",
              "汽车用品收纳包",
            ]
          : [
              "EVA Cases",
              "Pencil Cases",
              "First Aid Bags",
              "Toiletry Bags",
              "Bra Organizers",
              "Electronics Organizers",
              "Automotive Accessory Bags",
            ],
        customerTypes,
      }}
      story={{
        introduction: isChinese
          ? `${companyName}成立于2011年，专注于箱包及收纳产品制造。我们将材料选择、产品开发与生产制造相结合，为客户提供符合其产品需求的定制方案。`
          : `Established in 2011, ${companyName} specializes in bags, cases, and organizers. We bring together material selection, product development, and manufacturing to create custom solutions for our customers.`,
        establishmentReason: isChinese
          ? "我们的工厂设立在中国的贫困山区，以扶贫车间的形式，为当地困难群体创造就近就业的机会，让他们能够更方便地找到工作。"
          : "Our factory was established in a mountainous area of China affected by poverty. Through our poverty alleviation workshop, we help disadvantaged local residents find employment closer to home.",
        businessDevelopment: isChinese
          ? "如今，我们拥有145名员工及6,500平方米的生产场地，配备8条常规生产线和4条备用生产线。材料加工、成型、缝制及包装等生产环节均在厂内完成。"
          : "Today, our operation includes 145 employees and a 6,500 m² factory, supported by 8 regular production lines and 4 reserve lines. Material processing, forming, sewing, and packaging are carried out in-house.",
        productSpecialization: isChinese
          ? "我们专注于 EVA 箱包、笔袋、急救包、洗漱包、内衣收纳包、电子产品收纳包及汽车用品收纳包，可根据产品需求选用 EVA、PU、PVC 及涤纶等材料。"
          : "Our products include EVA cases, pencil cases, first aid bags, toiletry bags, bra organizers, electronics organizers, and automotive accessory bags. Material options include EVA, PU, PVC, and polyester.",
        internationalExperience: isChinese
          ? "我们希望让海外客户能够直接与工厂合作，通过清晰的沟通、定制开发和生产服务，建立长期合作关系。我们的目标是为客户提供适合其产品需求的包装与收纳解决方案。"
          : "Our vision is to help overseas customers work directly with the factory through clear communication, custom development, and manufacturing services. Our goal is to build lasting partnerships by providing packaging and storage solutions suited to each customer's products.",
      }}
      verification={{
        legalCompanyName: companyName,
        factoryAddress: isChinese
          ? "江西省上饶市玉山县南山乡港口村叶家"
          : "Yejia, Gangkou Village, Nanshan Township, Yushan County, Shangrao, Jiangxi, China",
      }}
      statistics={{
        factoryFloorArea: "6,500 m²",
        workforce: "145",
        productionLines: isChinese
          ? "8条常规 + 4条备用"
          : "8 regular + 4 reserve",
      }}
      milestones={{
        milestones: [
          {
            year: "2011",
            title: isChinese ? "公司成立" : "Company Established",
            description: isChinese
              ? `${companyName}成立，开展箱包及收纳产品制造业务。`
              : `${companyName} was established to manufacture bags, cases, and organizers.`,
          },
        ],
      }}
      markets={{
        exportRegions: [],
        countries: [],
        customerTypes,
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