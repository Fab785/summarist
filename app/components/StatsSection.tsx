"use client";

import { useEffect, useState } from "react";

const topHeadings = [
  "Enhance your knowledge",
  "Achieve greater success",
  "Improve your health",
  "Develop better parenting skills",
  "Increase happiness",
  "Be the best version of yourself!",
];

const bottomHeadings = [
  "Expand your learning",
  "Accomplish your goals",
  "Strengthen your vitality",
  "Become a better caregiver",
  "Improve your mood",
  "Maximize your abilities",
];

export default function StatsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % topHeadings.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="stats">
      <div className="container">
        <div className="row">
          <div className="stats__wrapper">
            <div className="stats__text">
              {topHeadings.map((heading, index) => (
                <h2
                  key={heading}
                  className={activeIndex === index ? "stats__heading active" : "stats__heading"}
                >
                  {heading}
                </h2>
              ))}
            </div>

            <div className="stats__card">
              <p>
                <span>93%</span> of Summarist members <b>significantly increase</b>{" "}
                reading frequency.
              </p>
              <p>
                <span>96%</span> of Summarist members <b>establish better</b> habits.
              </p>
              <p>
                <span>90%</span> have made <b>significant positive</b> change to their
                lives.
              </p>
            </div>
          </div>

          <div className="stats__wrapper stats__wrapper--reverse">
            <div className="stats__card">
              <p>
                <span>91%</span> of Summarist members <b>report feeling more productive</b>{" "}
                after incorporating the service into their daily routine.
              </p>
              <p>
                <span>94%</span> of Summarist members have <b>noticed an improvement</b>{" "}
                in their overall comprehension and retention of information.
              </p>
              <p>
                <span>88%</span> of Summarist members <b>feel more informed</b> about
                current events and industry trends since using the platform.
              </p>
            </div>

            <div className="stats__text stats__text--right">
              {bottomHeadings.map((heading, index) => (
                <h2
                  key={heading}
                  className={activeIndex === index ? "stats__heading active" : "stats__heading"}
                >
                  {heading}
                </h2>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}