
"use client";

import { useState } from "react";
import Handbag3D from "./Hangbag3D";
import styles from "./BannerHero.module.css";

const finishes = [
  {
    name: "Oxblood",
    color: "#6f2636",
  },
  {
    name: "Cognac",
    color: "#ae7445",
  },
  {
    name: "Obsidian",
    color: "#242726",
  },
  {
    name: "Limestone",
    color: "#c9bca0",
  },
];

export default function BannerHero() {
  const [selectedFinish, setSelectedFinish] = useState(finishes[0]);
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <section className={styles.hero} id="experience">
      {/* LEFT CONTENT */}
      <div className={styles.heroType}>
        <div className={styles.eyebrow}>
          <span>●</span> SCULPTED TO BE REMEMBERED
        </div>

        <h1>
          The art
          <br />
          of <em>carrying.</em>
        </h1>

        <p>
          Quiet confidence. Unmistakable presence.
          <br />
          Objects of desire, designed around you.
        </p>

        <div className={styles.heroLinks}>
          <a href="#collection" className={styles.button}>
            Discover the collection <span>↗</span>
          </a>

          <a href="#atelier" className={styles.textLink}>
            Create with us ↗
          </a>
        </div>

        <div className={styles.edition}>
          <span>01 — 04</span>
          <div />
          <span>THE FORME SIGNATURE</span>
        </div>
      </div>

      {/* RIGHT 3D STAGE */}
      <div className={styles.heroStage}>
        <div className={styles.halo} />

        <div className={styles.stageWord}>FORME</div>

        <Handbag3D
          color={selectedFinish.color}
          autoRotate={autoRotate}
            className={styles.handbagCanvas}
        />

        <div className={styles.stageTop}>
          <span>THE SIGNATURE / 01</span>
          <span>LIVE 3D OBJECT</span>
        </div>

        <div className={styles.annotation}>
          <span>01 / THE SILHOUETTE</span>
          <p>
            Soft geometry.
            <br />
            Strong character.
          </p>
        </div>

        {/* COLOR AND ROTATION CONTROLS */}
        <div className={styles.stageControls}>
          <div className={styles.finishSelector}>
            <span className={styles.micro}>SELECT A FINISH</span>

            <div className={styles.finishes}>
              {finishes.map((finish) => (
                <button
                  key={finish.name}
                  type="button"
                  className={
                    selectedFinish.name === finish.name
                      ? styles.selected
                      : ""
                  }
                  style={{
                    backgroundColor: finish.color,
                  }}
                  aria-label={`${finish.name} finish`}
                  aria-pressed={selectedFinish.name === finish.name}
                  onClick={() => setSelectedFinish(finish)}
                />
              ))}
            </div>

            <span className={styles.finishName}>
              {selectedFinish.name} / Champagne hardware
            </span>
          </div>

          <button
            type="button"
            className={styles.rotate}
            aria-pressed={autoRotate}
            onClick={() => setAutoRotate((previous) => !previous)}
          >
            ↔ &nbsp; Auto rotation {autoRotate ? "on" : "off"}
            <span>360°</span>
          </button>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className={styles.heroBottom}>
        <span>CONSIDERED IN EVERY DETAIL.</span>
        <a href="#collection">SCROLL TO DISCOVER ↓</a>
        <span>DESIGN · MATERIAL · FORM</span>
      </div>
    </section>
  );
}
