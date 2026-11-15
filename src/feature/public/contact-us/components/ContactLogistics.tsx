import ContactIcon from "./ContactIcon";
import { contact } from "./ContactData";

type Props = {
  data: any;
  business: any;
};

export default function ContactLogistics({
  data,
  business,
}: Props) {
  return (
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
            <ContactIcon kind="clock" />

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
  );
}