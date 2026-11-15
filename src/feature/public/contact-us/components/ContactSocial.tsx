import ContactIcon from "./ContactIcon";
import { contact } from "./ContactData";
type Props = {
  data: any;
  business: any;
};

export default function ContactSocial({
  data,
  business,
}: Props) {
  return (
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
              <ContactIcon kind="arrow" />
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
  );
}