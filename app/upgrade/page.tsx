"use client";

import { useState } from "react";
import { FaFileAlt, FaSeedling, FaHandshake } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

type Plan = "yearly" | "monthly";

const faqs = [
  {
    question: "How does the free 7-day trial work?",
    answer:
      "Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial.",
  },
  {
    question:
      "Can I switch subscriptions from monthly to yearly, or yearly to monthly?",
    answer:
      "While an annual plan is active, it is not feasible to switch to a monthly plan. However, once the current month ends, transitioning from a monthly plan to an annual plan is an option.",
  },
  {
    question: "What's included in the Premium plan?",
    answer:
      "Premium membership provides you with the ultimate Summarist experience, including unrestricted entry to many best-selling books, high-quality audio, the ability to download titles for offline reading, and the option to send your reads to your Kindle.",
  },
  {
    question: "Can I cancel during my trial or subscription?",
    answer:
      "You will not be charged if you cancel your trial before its conclusion. While you will not have complete access to the entire Summarist library, you can still expand your knowledge with one curated book per day.",
  },
];

export default function UpgradePage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>("yearly");
  const [openFaq, setOpenFaq] = useState(0);

  const buttonText =
    selectedPlan === "yearly"
      ? "Start your free 7-day trial"
      : "Start your first month";

  const buttonSubtext =
    selectedPlan === "yearly"
      ? "Cancel your trial at any time before it ends, and you won’t be charged."
      : "You will be charged monthly until you cancel your subscription.";

  const handleCheckout = () => {
    console.log("Selected plan:", selectedPlan);
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

      <section className="upgrade-drawer">
        <section className="upgrade-plans">
          <h2>Choose the plan that fits you</h2>

          <button
            type="button"
            className={`upgrade-plan ${
              selectedPlan === "yearly" ? "upgrade-plan--active" : ""
            }`}
            onClick={() => setSelectedPlan("yearly")}
          >
            <div className="upgrade-plan__radio">
              {selectedPlan === "yearly" && <div />}
            </div>

            <div>
              <h3>Premium Plus Yearly</h3>
              <h4>$99.99/year</h4>
              <p>7-day free trial included</p>
            </div>
          </button>

          <div className="upgrade-or">
            <span />
            <p>or</p>
            <span />
          </div>

          <button
            type="button"
            className={`upgrade-plan ${
              selectedPlan === "monthly" ? "upgrade-plan--active" : ""
            }`}
            onClick={() => setSelectedPlan("monthly")}
          >
            <div className="upgrade-plan__radio">
              {selectedPlan === "monthly" && <div />}
            </div>

            <div>
              <h3>Premium Monthly</h3>
              <h4>$9.99/month</h4>
              <p>No trial included</p>
            </div>
          </button>
        </section>

        <section className="upgrade-action">
          <button type="button" onClick={handleCheckout}>
            {buttonText}
          </button>

          <p>{buttonSubtext}</p>
        </section>
      </section>

      <section className="upgrade-faq">
        {faqs.map((faq, index) => {
          const isOpen = openFaq === index;

          return (
            <div className="upgrade-faq__item" key={faq.question}>
              <button
                type="button"
                className="upgrade-faq__question"
                onClick={() => setOpenFaq(isOpen ? -1 : index)}
              >
                <span>{faq.question}</span>
                {isOpen ? <FiChevronUp /> : <FiChevronDown />}
              </button>

              {isOpen && <p className="upgrade-faq__answer">{faq.answer}</p>}
            </div>
          );
        })}
      </section>

      <footer className="upgrade-footer">
        <div className="upgrade-footer__inner">
          <div>
            <h4>Actions</h4>
            <p>Summarist Magazine</p>
            <p>Cancel Subscription</p>
            <p>Help</p>
            <p>Contact us</p>
          </div>

          <div>
            <h4>Useful Links</h4>
            <p>Pricing</p>
            <p>Summarist Business</p>
            <p>Gift Cards</p>
            <p>Authors &amp; Publishers</p>
          </div>

          <div>
            <h4>Company</h4>
            <p>About</p>
            <p>Careers</p>
            <p>Partners</p>
            <p>Code of Conduct</p>
          </div>

          <div>
            <h4>Other</h4>
            <p>Sitemap</p>
            <p>Legal Notice</p>
            <p>Terms of Service</p>
            <p>Privacy Policies</p>
          </div>
        </div>

        <p className="upgrade-footer__copyright">
          Copyright © 2023 Summarist.
        </p>
      </footer>
    </main>
  );
}