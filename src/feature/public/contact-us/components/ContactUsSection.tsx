



"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useLanguage } from "@/src/providers";

const contact = {
  whatsapp: "",
  factoryAddress: "",
  factoryMapQuery: "",
  businessHours: "",
  responseTime: "",
  socialProfiles: [] as {
    name: string;
    url: string;
  }[],
};

type IconKind =
  | "email"
  | "phone"
  | "chat"
  | "pin"
  | "clock"
  | "arrow";

function Icon({ kind }: { kind: IconKind }) {
  const paths = {
    email: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    phone: (
      <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a15 15 0 0 1-7-7l2-2-2-5Z" />
    ),
    chat: (
      <>
        <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5Z" />
        <path d="M8 12h8M8 8h5" />
      </>
    ),
    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    arrow: <path d="M5 19 19 5M5 5h14v14" />,
  };

  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[kind]}
    </svg>
  );
}

export default function ContactUsSection() {
  const { t, locale } = useLanguage();

  const data = t.contactUs;
  const business = t.finalCta.contactInfo;

  const [mapLoaded, setMapLoaded] = useState(false);
  const [draftPrepared, setDraftPrepared] = useState(false);
  const [copied, setCopied] = useState(false);

  const phoneHref = business.phonePrimary
    .replace(/^\+86\s*\(0(\d+)\)/, "+86$1")
    .replace(/\(0\)/g, "")
    .replace(/[^+\d]/g, "");

  const hasFactoryLocation = Boolean(
    contact.factoryMapQuery || contact.factoryAddress
  );

  const mapQuery =
    contact.factoryMapQuery ||
    contact.factoryAddress ||
    business.address;

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(business.email);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fields = new FormData(event.currentTarget);
    const labels = data.form.emailBodyLabels;

    const subject =
      `[${data.form.emailSubjectPrefix}] ` +
      `${fields.get("subject")} — ` +
      `${fields.get("company") || fields.get("name")}`;

    const body = [
      `${labels.name}: ${fields.get("name")}`,
      `${labels.company}: ${fields.get("company") || "—"}`,
      `${labels.email}: ${fields.get("email")}`,
      `${labels.telephone}: ${fields.get("phone") || "—"}`,
      `${labels.country}: ${fields.get("country") || "—"}`,
      "",
      String(fields.get("message") || ""),
    ].join("\n");

    window.location.href =
      `mailto:${business.email}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    setDraftPrepared(true);
  }

  return (
    <div
      className="contact-page"
      lang={locale === "zh" ? "zh-CN" : "en"}
    >
      {/* 01. Contact introduction */}
      <section
        className="contact-hero"
        aria-labelledby="contact-heading"
      >
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

              <a
                className="contact-button"
                href="#general-enquiry"
              >
                {data.introduction.button}
                <span>↗</span>
              </a>
            </div>

            <div className="contact-hero-art" aria-hidden="true">
              <div className="contact-orbit" />
              <div className="contact-orbit inner" />

              <div className="contact-art-center">
                <Icon kind="chat" />
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

      <div className="contact-wrap contact-content">
        {/* 02–04. Email, telephone and WhatsApp */}
        <section
          id="contact-methods"
          aria-labelledby="contact-methods-heading"
        >
          <div className="contact-section-head">
            <div>
              <span className="contact-kicker">
                {data.contactMethods.eyebrow}
              </span>

              <h2 id="contact-methods-heading">
                {data.contactMethods.title}
              </h2>
            </div>

            <p>{data.contactMethods.description}</p>
          </div>

          <div className="contact-method-grid">
            <article className="contact-method">
              <div className="contact-card-top">
                <Icon kind="email" />
                <span>02</span>
              </div>

              <span className="contact-label">
                {data.email.label}
              </span>

              <a
                className="contact-email"
                href={`mailto:${business.email}`}
              >
                {business.email}
              </a>

              <p>{data.email.description}</p>

              <button
                className="contact-small-link"
                onClick={copyEmail}
                type="button"
                aria-live="polite"
              >
                {copied
                  ? `${data.email.copied} ✓`
                  : `${data.email.copy} ↗`}
              </button>
            </article>

            <article className="contact-method">
              <div className="contact-card-top">
                <Icon kind="phone" />
                <span>03</span>
              </div>

              <span className="contact-label">
                {data.telephone.label}
              </span>

              <a
                className="contact-method-value"
                href={`tel:${phoneHref}`}
              >
                {business.phonePrimary}
              </a>

              <p>{data.telephone.description}</p>

              <a
                className="contact-small-link"
                href={`tel:${phoneHref}`}
              >
                {data.telephone.button} ↗
              </a>
            </article>

            <article className="contact-method">
              <div className="contact-card-top">
                <Icon kind="chat" />
                <span>04</span>
              </div>

              <span className="contact-label">
                {data.whatsapp.label}
              </span>

              <h3 className="contact-method-value">
                {data.whatsapp.title}
              </h3>

              <p>
                {contact.whatsapp
                  ? `+${contact.whatsapp}`
                  : data.whatsapp.description}
              </p>

              <a
                className="contact-small-link"
                href={
                  contact.whatsapp
                    ? `https://wa.me/${contact.whatsapp}`
                    : `mailto:${business.email}?subject=${encodeURIComponent(
                        data.whatsapp.request
                      )}`
                }
                {...(contact.whatsapp
                  ? {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    }
                  : {})}
              >
                {contact.whatsapp
                  ? data.whatsapp.open
                  : data.whatsapp.request}{" "}
                ↗
              </a>
            </article>
          </div>
        </section>

        {/* 05–08. Addresses, hours and response time */}
        <section
          className="contact-logistics"
          aria-label={data.locations.label}
        >
          <div className="contact-addresses">
            <article>
              <span className="contact-label">
                {data.locations.headOffice.label}
              </span>

              <h3>{data.locations.headOffice.title}</h3>

              <address>{business.address}</address>
            </article>

            <article>
              <span className="contact-label">
                {data.locations.factory.label}
              </span>

              <h3>{data.locations.factory.title}</h3>

              <address>
                {contact.factoryAddress ||
                  data.locations.factory.pendingAddress}
              </address>
            </article>
          </div>

          <div className="contact-availability">
            <article>
              <span className="contact-label">
                {data.businessHours.label}
              </span>

              <div className="contact-time">
                <Icon kind="clock" />
                <span>
                  {data.businessHours.timeZone}
                  <b>{data.businessHours.utcOffset}</b>
                </span>
              </div>

              <p>
                {contact.businessHours ||
                  data.businessHours.pendingHours}
              </p>
            </article>

            <article>
              <span className="contact-label">
                {data.responseTime.label}
              </span>

              <h3>{data.responseTime.title}</h3>

              <p>
                {contact.responseTime ||
                  data.responseTime.description}
              </p>
            </article>
          </div>
        </section>

        {/* 09. Factory visits */}
        <section
          className="contact-visit"
          aria-labelledby="visit-heading"
        >
          <div>
            <span className="contact-kicker">
              {data.factoryVisit.eyebrow}
            </span>

            <h2 id="visit-heading">
              {data.factoryVisit.title}
              <br />
              <em>{data.factoryVisit.highlightedTitle}</em>
            </h2>

            <p>{data.factoryVisit.description}</p>

            <a
              href={`mailto:${business.email}?subject=${encodeURIComponent(
                data.factoryVisit.button
              )}`}
              className="contact-button contact-light"
            >
              {data.factoryVisit.button}
              <span>↗</span>
            </a>
          </div>

          <ol>
            {data.factoryVisit.steps.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>

                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 10. Map loaded after interaction */}
        <section
          className="contact-map-section"
          aria-labelledby="map-heading"
        >
          <div className="contact-section-head">
            <div>
              <span className="contact-kicker">
                {data.map.eyebrow}
              </span>

              <h2 id="map-heading">{data.map.title}</h2>
            </div>

            <p>
              {hasFactoryLocation
                ? data.map.confirmedDescription
                : data.map.pendingDescription}
            </p>
          </div>

          <div className="contact-map">
            {mapLoaded ? (
              <>
                <iframe
                  title={data.map.iframeTitle}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    mapQuery
                  )}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  allowFullScreen
                />

                <a
                  className="contact-map-external"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    mapQuery
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.map.openLarger} ↗
                </a>
              </>
            ) : (
              <div className="contact-map-placeholder">
                <div className="contact-map-pin">
                  <Icon kind="pin" />
                </div>

                <span className="contact-label">
                  {data.map.placeholderLabel}
                </span>

                <h3>{data.map.placeholderTitle}</h3>
                <p>{data.map.placeholderDescription}</p>

                <button
                  className="contact-button"
                  type="button"
                  onClick={() => setMapLoaded(true)}
                >
                  {hasFactoryLocation
                    ? data.map.loadFactory
                    : data.map.loadHeadOffice}
                  <span>↗</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 11. General contact form */}
        <section
          id="general-enquiry"
          className="contact-form-section"
          aria-labelledby="enquiry-heading"
        >
          <div>
            <span className="contact-kicker">
              {data.form.eyebrow}
            </span>

            <h2 id="enquiry-heading">
              {data.form.title}
              <br />
              <em>{data.form.highlightedTitle}</em>
            </h2>

            <p>{data.form.description}</p>

            <div className="contact-form-note">
              <Icon kind="email" />

              <span>
                {data.form.directEmail}
                <a href={`mailto:${business.email}`}>
                  {business.email}
                </a>
              </span>
            </div>
          </div>

          <form onSubmit={prepareEmail} className="contact-form">
            <div className="contact-fields">
              <label>
                {data.form.name} <span>*</span>
                <input
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  placeholder={data.form.namePlaceholder}
                />
              </label>

              <label>
                {data.form.company}
                <input
                  name="company"
                  autoComplete="organization"
                  maxLength={150}
                  placeholder={data.form.companyPlaceholder}
                />
              </label>

              <label>
                {data.form.email} <span>*</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  placeholder={data.form.emailPlaceholder}
                />
              </label>

              <label>
                {data.form.telephone}
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={40}
                  placeholder={data.form.telephonePlaceholder}
                />
              </label>

              <label>
                {data.form.country}
                <input
                  name="country"
                  autoComplete="country-name"
                  maxLength={100}
                  placeholder={data.form.countryPlaceholder}
                />
              </label>

              <label>
                {data.form.subject}
                <select name="subject">
                  {Object.entries(data.form.subjects).map(
                    ([key, label]) => (
                      <option key={key} value={label}>
                        {label}
                      </option>
                    )
                  )}
                </select>
              </label>
            </div>

            <label>
              {data.form.message} <span>*</span>
              <textarea
                name="message"
                rows={5}
                required
                maxLength={4000}
                placeholder={data.form.messagePlaceholder}
              />
            </label>

            <p className="contact-form-hint">
              {data.form.requiredNote}
            </p>

            <button className="contact-button" type="submit">
              {data.form.button}
              <span>↗</span>
            </button>

            <p role="status" className="contact-form-status">
              {draftPrepared ? data.form.draftPrepared : ""}
            </p>
          </form>
        </section>

        {/* 12. Social media */}
        <section
          className="contact-social"
          aria-labelledby="social-heading"
        >
          <div>
            <span className="contact-kicker">
              {data.social.eyebrow}
            </span>

            <h2 id="social-heading">{data.social.title}</h2>
            <p>{data.social.description}</p>
          </div>

          <div className="contact-social-links">
            {contact.socialProfiles.length > 0 ? (
              contact.socialProfiles.map((profile) => (
                <a
                  key={profile.url}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile.name}
                  <Icon kind="arrow" />
                </a>
              ))
            ) : (
              <div>
                <span className="contact-label">
                  {data.social.profilesLabel}
                </span>

                <p>{data.social.pendingProfiles}</p>

                <a
                  href={`mailto:${business.email}?subject=${encodeURIComponent(
                    data.social.requestProfiles
                  )}`}
                >
                  {data.social.requestProfiles} ↗
                </a>
              </div>
            )}
          </div>
        </section>
      </div>

      <style jsx>{`
        .contact-page {
          background: var(--background);
          color: var(--primary);
        }

        .contact-wrap {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 28px;
        }

        .contact-hero {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid var(--border);
          background:
            radial-gradient(
              ellipse at 90% 50%,
              #a58b6517,
              transparent 55%
            ),
            var(--background);
        }

        .contact-breadcrumb {
          display: flex;
          gap: 14px;
          padding-top: 30px;
          font-size: 10px;
          color: var(--secondary);
        }

        .contact-hero-grid {
          display: grid;
          grid-template-columns: 1.45fr 1fr;
          gap: 60px;
          align-items: center;
          padding: 65px 0 70px;
        }

        .contact-kicker,
        .contact-label {
          display: block;
          font-size: 9px;
          letter-spacing: 0.2em;
          color: var(--accent);
          line-height: 1.8;
        }

        .contact-hero h1 {
          font: 400 clamp(44px, 5.5vw, 76px) / 1.06 Georgia, serif;
          letter-spacing: -0.045em;
          margin: 26px 0;
        }

        .contact-page em {
          font-weight: 400;
          color: var(--accent);
        }

        .contact-page p {
          font-size: 13px;
          line-height: 1.9;
          color: var(--secondary);
        }

        .contact-hero p {
          max-width: 490px;
          margin-bottom: 28px;
        }

        .contact-button {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          background: var(--primary);
          color: var(--background);
          padding: 17px 24px;
          border: 1px solid var(--primary);
          font-size: 11px;
          transition:
            transform 0.25s,
            box-shadow 0.25s;
        }

        .contact-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px #17171717;
        }

        .contact-hero-art {
          position: relative;
          aspect-ratio: 1;
          max-width: 370px;
          width: 100%;
          justify-self: center;
          perspective: 1000px;
        }

        .contact-orbit {
          position: absolute;
          inset: 4%;
          border: 1px solid #a58b6544;
          border-radius: 50%;
          transform: rotateX(20deg) rotateY(-20deg);
        }

        .contact-orbit.inner {
          inset: 15%;
          border-style: dashed;
          transform: rotateX(-18deg) rotateY(25deg);
        }

        .contact-art-center {
          position: absolute;
          inset: 24% 18%;
          border: 1px solid #a58b6544;
          background: #ffffff66;
          box-shadow: 0 25px 55px #a58b6515;
          backdrop-filter: blur(12px);
          border-radius: 70px 70px 4px 4px;
          padding: 30px 20px;
          text-align: center;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          gap: 14px;
          transform: rotate(-7deg);
        }

        .contact-art-center span {
          font-size: 7px;
          letter-spacing: 0.22em;
          color: var(--accent);
        }

        .contact-art-center i {
          font: italic 28px / 1.2 Georgia, serif;
        }

        .contact-art-caption {
          position: absolute;
          bottom: 0;
          width: 100%;
          text-align: center;
          font-size: 7px;
          letter-spacing: 0.15em;
          color: var(--secondary);
        }

        .contact-hero-bottom {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid var(--border);
          padding: 20px 0;
          font-size: 8px;
          letter-spacing: 0.12em;
          color: var(--secondary);
        }

        .contact-content {
          padding-top: 75px;
        }

        .contact-section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 35px;
          margin-bottom: 30px;
        }

        .contact-page h2 {
          font: 400 clamp(30px, 3.2vw, 43px) / 1.2 Georgia, serif;
          letter-spacing: -0.03em;
          margin: 12px 0;
        }

        .contact-section-head > p {
          font-size: 11px;
          max-width: 340px;
          margin: 0 0 6px;
        }

        .contact-method-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .contact-method {
          padding: 30px 24px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 60px 60px 6px 6px;
          transition:
            transform 0.3s,
            box-shadow 0.3s;
        }

        .contact-method:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 36px #17171708;
        }

        .contact-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--accent);
          margin: 5px 6px 30px;
        }

        .contact-card-top span {
          font: italic 15px Georgia, serif;
        }

        .contact-email {
          display: block;
          font-size: clamp(12px, 1.3vw, 17px);
          overflow-wrap: anywhere;
          margin: 15px 0 0;
        }

        .contact-method-value {
          display: block;
          font: 400 22px / 1.4 Georgia, serif;
          margin: 13px 0 0;
        }

        .contact-method p {
          font-size: 11px;
          min-height: 44px;
          margin: 13px 0 20px;
        }

        .contact-small-link {
          font-size: 10px;
          border-bottom: 1px solid #a58b6555;
          padding: 0 0 5px;
        }

        .contact-logistics {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 70px;
          margin: 65px 0;
          padding-top: 40px;
          border-top: 1px solid var(--border);
        }

        .contact-addresses,
        .contact-availability {
          display: grid;
          gap: 32px;
        }

        .contact-logistics article + article {
          padding-top: 30px;
          border-top: 1px solid var(--border);
        }

        .contact-page h3 {
          font: 400 24px / 1.35 Georgia, serif;
          margin: 12px 0;
        }

        .contact-logistics address {
          font-style: normal;
          font-size: 13px;
          line-height: 1.9;
          color: var(--secondary);
          max-width: 460px;
        }

        .contact-logistics p {
          font-size: 12px;
          margin: 10px 0;
        }

        .contact-time {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-top: 16px;
          font-size: 14px;
        }

        .contact-time b {
          display: block;
          font-weight: 400;
          color: var(--accent);
          font-size: 10px;
          margin-top: 5px;
        }

        .contact-visit {
          background: var(--primary);
          color: var(--background);
          padding: 50px;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 70px;
          border-radius: 4px;
        }

        .contact-visit p {
          color: #ffffff9c;
          font-size: 12px;
        }

        .contact-visit h2 {
          font-size: 44px;
        }

        .contact-light {
          background: var(--background);
          color: var(--primary);
          margin-top: 18px;
        }

        .contact-visit ol {
          list-style: none;
          padding: 0;
          margin: 0;
          align-self: center;
        }

        .contact-visit li {
          display: flex;
          gap: 24px;
          padding: 20px 0;
          border-bottom: 1px solid #ffffff1a;
        }

        .contact-visit li:last-child {
          border-bottom: 0;
        }

        .contact-visit li > span {
          color: var(--accent);
          font: italic 20px Georgia, serif;
          padding-top: 7px;
        }

        .contact-visit li h3 {
          font-size: 21px;
          margin: 0 0 5px;
        }

        .contact-visit li p {
          font-size: 11px;
          margin: 0;
        }

        .contact-map-section {
          margin: 70px 0;
        }

        .contact-map {
          height: 400px;
          position: relative;
          border: 1px solid var(--border);
          overflow: hidden;
          background: var(--surface-muted);
        }

        .contact-map-placeholder {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 30px;
          background:
            linear-gradient(
              90deg,
              #a58b650b 1px,
              transparent 1px
            ),
            linear-gradient(#a58b650b 1px, transparent 1px);
          background-size: 45px 45px;
        }

        .contact-map-pin {
          background: var(--surface);
          padding: 16px;
          border: 1px solid var(--border);
          border-radius: 50%;
          margin-bottom: 18px;
          color: var(--accent);
        }

        .contact-map-placeholder h3 {
          margin: 10px 0;
          font-size: 28px;
        }

        .contact-map-placeholder p {
          font-size: 11px;
          max-width: 360px;
          margin: 0 0 20px;
        }

        .contact-map iframe {
          width: 100%;
          height: 100%;
          border: 0;
        }

        .contact-map-external {
          position: absolute;
          bottom: 16px;
          right: 16px;
          background: var(--surface);
          color: var(--primary);
          padding: 12px 18px;
          font-size: 11px;
          box-shadow: 0 3px 20px #0002;
        }

        .contact-form-section {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 75px;
          padding: 55px 0 65px;
          border-top: 1px solid var(--border);
          scroll-margin-top: 105px;
        }

        .contact-form-section h2 {
          font-size: 48px;
        }

        .contact-form-section > div > p {
          max-width: 340px;
          font-size: 12px;
        }

        .contact-form-note {
          display: flex;
          gap: 15px;
          align-items: center;
          border-top: 1px solid var(--border);
          padding-top: 22px;
          margin-top: 35px;
          color: var(--accent);
        }

        .contact-form-note span {
          font-size: 10px;
          color: var(--secondary);
        }

        .contact-form-note a {
          display: block;
          color: var(--primary);
          margin-top: 8px;
          overflow-wrap: anywhere;
        }

        .contact-form {
          padding: 30px;
          background: var(--surface);
          border: 1px solid var(--border);
        }

        .contact-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 23px;
          margin-bottom: 25px;
        }

        .contact-form label {
          font-size: 10px;
          color: var(--primary);
        }

        .contact-form label > span {
          color: var(--accent);
        }

        .contact-form input,
        .contact-form select,
        .contact-form textarea {
          display: block;
          width: 100%;
          border: 0;
          border-bottom: 1px solid var(--border);
          background: transparent;
          color: var(--primary);
          padding: 12px 0;
          font-family: inherit;
          font-size: 12px;
          line-height: 1.5;
          border-radius: 0;
          outline: none;
        }

        .contact-form input:focus,
        .contact-form select:focus,
        .contact-form textarea:focus {
          border-color: var(--accent);
          box-shadow: 0 1px 0 var(--accent);
        }

        .contact-form textarea {
          resize: vertical;
          min-height: 120px;
        }

        .contact-form input::placeholder,
        .contact-form textarea::placeholder {
          color: var(--secondary);
          opacity: 0.7;
        }

        .contact-form .contact-form-hint {
          font-size: 10px;
          margin: 17px 0 22px;
        }

        .contact-form-status {
          font-size: 11px !important;
          margin: 15px 0 0 !important;
        }

        .contact-form-status:empty {
          display: none;
        }

        .contact-social {
          display: flex;
          justify-content: space-between;
          gap: 40px;
          align-items: center;
          border-top: 1px solid var(--border);
          padding: 45px 0 65px;
        }

        .contact-social h2 {
          font-size: 34px;
        }

        .contact-social p {
          font-size: 11px;
        }

        .contact-social-links {
          max-width: 370px;
        }

        .contact-social-links > div {
          padding-left: 25px;
          border-left: 1px solid var(--border);
        }

        .contact-social-links a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          font-size: 11px;
          margin-top: 12px;
        }

        .contact-page :is(a, button):focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 5px;
        }

        .contact-page:lang(zh-CN) h1 {
          font-size: clamp(36px, 4.3vw, 59px);
          line-height: 1.35;
          letter-spacing: 0.01em;
        }

        .contact-page:lang(zh-CN) em {
          font-style: normal;
        }

        .contact-page:lang(zh-CN) h2 {
          line-height: 1.4;
        }

        .contact-page:lang(zh-CN) h3 {
          line-height: 1.5;
        }

        @media (max-width: 1000px) {
          .contact-hero-grid {
            gap: 25px;
          }

          .contact-art-center i {
            font-size: 22px;
          }

          .contact-method-grid {
            gap: 12px;
          }

          .contact-method {
            padding: 28px 18px;
          }

          .contact-logistics,
          .contact-visit,
          .contact-form-section {
            gap: 35px;
          }

          .contact-visit {
            padding: 35px;
          }
        }

        @media (max-width: 720px) {
          .contact-wrap {
            padding-left: 20px;
            padding-right: 20px;
          }

          .contact-hero-grid {
            grid-template-columns: 1fr;
            padding: 42px 0 38px;
            gap: 28px;
          }

          .contact-hero-art {
            max-width: 250px;
          }

          .contact-hero h1 {
            font-size: 49px;
          }

          .contact-art-center {
            inset: 18% 15%;
            padding: 18px;
          }

          .contact-art-center i {
            font-size: 23px;
          }

          .contact-hero-bottom {
            font-size: 7px;
            gap: 20px;
            line-height: 1.8;
          }

          .contact-content {
            padding-top: 45px;
          }

          .contact-section-head {
            display: block;
          }

          .contact-section-head > p {
            margin-top: 15px;
          }

          .contact-method-grid {
            grid-template-columns: 1fr;
          }

          .contact-method {
            border-radius: 40px 40px 5px 5px;
            padding: 25px;
          }

          .contact-card-top {
            margin-bottom: 20px;
          }

          .contact-method p {
            min-height: 0;
          }

          .contact-email {
            font-size: 17px;
          }

          .contact-logistics {
            grid-template-columns: 1fr;
            gap: 35px;
            margin: 40px 0;
          }

          .contact-availability {
            padding-top: 30px;
            border-top: 1px solid var(--border);
          }

          .contact-visit {
            grid-template-columns: 1fr;
            padding: 30px 24px;
            gap: 25px;
          }

          .contact-visit h2 {
            font-size: 38px;
          }

          .contact-map-section {
            margin: 45px 0;
          }

          .contact-map {
            height: 410px;
          }

          .contact-form-section {
            grid-template-columns: 1fr;
            padding: 40px 0;
            gap: 30px;
          }

          .contact-form-section h2 {
            font-size: 42px;
          }

          .contact-form {
            padding: 24px 20px;
          }

          .contact-fields {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .contact-social {
            align-items: start;
            flex-direction: column;
            gap: 20px;
            padding-bottom: 45px;
          }

          .contact-social-links > div {
            padding-left: 0;
            border-left: 0;
          }

          .contact-social h2 {
            font-size: 30px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .contact-page * {
            transition: none !important;
          }

          .contact-button:hover,
          .contact-method:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}