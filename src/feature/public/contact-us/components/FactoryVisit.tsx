type Props = {
  data: any;
  business: any;
};

export default function FactoryVisit({
  data,
  business,
}: Props) {
  return (
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
        {data.factoryVisit.steps.map((step: any) => (
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
  );
}