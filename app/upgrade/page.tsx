"use client";

import { FaFileAlt, FaSeedling, FaHandshake } from "react-icons/fa";

export default function UpgradePage() {
  const handleStripeCheckout = () => {
    window.location.href = "https://buy.stripe.com/test_YOUR_LINK_HERE";
  };

  return (
    <main className="upgrade-page">
      <section className="upgrade-hero">
        <h1>
          Get unlimited access to many amazing
          <br />
          books to read
        </h1>

        <p>Turn ordinary moments into amazing learning opportunities</p>

        <div className="upgrade-hero__image-wrap">
  <img
    src="/assets/undraw_pay-online_806n.svg"
    alt="Upgrade"
    className="upgrade-hero__image"
  />
</div>
      </section>

      <section className="upgrade-benefits">
        <div className="upgrade-benefit">
          <FaFileAlt />
          <p>
            <strong>Key ideas in few min</strong> with many
            <br />
            books to read
          </p>
        </div>

        <div className="upgrade-benefit">
          <FaSeedling />
          <p>
            <strong>3 million</strong> people growing with
            <br />
            Summarist everyday
          </p>
        </div>

        <div className="upgrade-benefit">
          <FaHandshake />
          <p>
            <strong>Precise recommendations</strong>
            <br />
            collections curated by experts
          </p>
        </div>
      </section>

      <div className="upgrade-action">
        <button type="button" onClick={handleStripeCheckout}>
          Start your free 7-day trial
        </button>

        <p>Cancel your trial at any time before it ends, and you won’t be charged.</p>
      </div>
    </main>
  );
}