import type { FormEvent } from "react";
import ContactIcon from "./ContactIcon";

type Props = {
  data: any;
  business: any;
  draftPrepared: boolean;
  prepareEmail: (event: FormEvent<HTMLFormElement>) => void;
};

export default function ContactForm({
  data,
  business,
  draftPrepared,
  prepareEmail,
}: Props) {
  return (
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
          <ContactIcon kind="email" />

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
                ([key, label]: [string, any]) => (
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
  );
}