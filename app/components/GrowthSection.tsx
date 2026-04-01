"use client";

import { FaCrown, FaStar, FaLeaf } from "react-icons/fa";

export default function GrowthSection() {
  return (
    <section className="growth">
      <div className="container">
        <div className="row">
          <h2 className="section__title growth__title">
            Start growing with Summarist now
          </h2>

          <div className="growth__cards">
            <div className="growth__card">
              <FaCrown className="growth__icon" />
              <h3 className="growth__card-title">3 Million</h3>
              <p className="growth__card-text">Downloads on all platforms</p>
            </div>

            <div className="growth__card">
              <FaStar className="growth__icon" />
              <h3 className="growth__card-title">4.5 Stars</h3>
              <p className="growth__card-text">
                Average ratings on iOS and Google Play
              </p>
            </div>

            <div className="growth__card">
              <FaLeaf className="growth__icon" />
              <h3 className="growth__card-title">97%</h3>
              <p className="growth__card-text">
                Of Summarist members create a better reading habit
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}