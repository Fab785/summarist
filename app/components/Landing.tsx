"use client";

type LandingProps = {
  onLoginClick: () => void;
};

export default function Landing({ onLoginClick }: LandingProps) {
  return (
    <section id="landing">
      <div className="container">
        <div className="row">
          <div className="landing__wrapper">
            <div className="landing__content">
              <h1 className="landing__content__title">
                Gain more knowledge <br className="remove--tablet" />
                in less time
              </h1>

              <p className="landing__content__subtitle">
                Great summaries for busy people,
                <br className="remove--tablet" />
                individuals who barely have time to read,
                <br className="remove--tablet" />
                and even people who don’t like to read.
              </p>

              <button
                className="btn home__cta--btn"
                onClick={onLoginClick}
                type="button"
              >
                Login
              </button>
            </div>

            <figure className="landing__image--mask">
              <img src="/assets/landing.png" alt="Summarist landing illustration" />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}