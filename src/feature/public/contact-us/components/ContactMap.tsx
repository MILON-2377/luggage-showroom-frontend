import ContactIcon from "./ContactIcon";
import { contact } from "./ContactData";


type Props = {
  data: any;
  business: any;
  mapLoaded: boolean;
  setMapLoaded: (value: boolean) => void;
};

export default function ContactMap({
  data,
  business,
  mapLoaded,
  setMapLoaded,
}: Props) {
  const hasFactoryLocation = Boolean(
    contact.factoryMapQuery || contact.factoryAddress
  );

  const mapQuery =
    contact.factoryMapQuery ||
    contact.factoryAddress ||
    business.address;

  return (
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
              <ContactIcon kind="pin" />
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
  );
}