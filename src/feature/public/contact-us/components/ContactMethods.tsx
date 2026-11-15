import { contact } from "./ContactData";
import ContactIcon from "./ContactIcon";

type Props = {
  data: any;
  business: any;
  copied: boolean;
  copyEmail: () => void;
  phoneHref: string;
};

export default function ContactMethods({
  data,
  business,
  copied,
  copyEmail,
  phoneHref,
}: Props) {
  return (
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
            <ContactIcon kind="email" />
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
            <ContactIcon kind="phone" />
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
            <ContactIcon kind="chat" />
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
  );
}