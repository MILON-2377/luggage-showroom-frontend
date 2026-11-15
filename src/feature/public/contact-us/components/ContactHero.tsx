import Link from "next/link";
import ContactIcon from "./ContactIcon";

type Props = {
  data: any;
};

export default function ContactHero({ data }: Props) {
  return (
    <section className="contact-hero" aria-labelledby="contact-heading">
      <div className="contact-wrap">
        <div className="contact-breadcrumb">
          <Link href="/">{data.home}</Link>
          <span>/</span>
          <span>{data.breadcrumb}</span>
        </div>

        <div className="contact-hero-grid">
          <div>
            <span className="contact-kicker">
              {data.introduction.eyebrow}
            </span>

            <h1 id="contact-heading">
              {data.introduction.title}
              <br />
              <em>{data.introduction.highlightedTitle}</em>
            </h1>

            <p>{data.introduction.description}</p>

            <a className="contact-button" href="#general-enquiry">
              {data.introduction.button}
              <span>↗</span>
            </a>
          </div>

          <div className="contact-hero-art" aria-hidden="true">
            <div className="contact-orbit" />
            <div className="contact-orbit inner" />

            <div className="contact-art-center">
              <ContactIcon kind="chat" />
              <span>{data.introduction.artLabel}</span>
              <i>{data.introduction.artTitle}</i>
            </div>

            <span className="contact-art-caption">
              {data.introduction.artCaption}
            </span>
          </div>
        </div>

        <div className="contact-hero-bottom">
          <span>{data.introduction.footerText}</span>

          <a href="#contact-methods">
            {data.introduction.scrollText} ↓
          </a>
        </div>
      </div>
    </section>
  );
}