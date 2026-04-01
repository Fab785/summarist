"use client";

const testimonials = [
  {
    name: "Hanna M.",
    text: "This app has been a game-changer for me! It's saved me so much time and effort in reading and comprehending books. Highly recommend it to all book lovers.",
  },
  {
    name: "David B.",
    text: "I love this app! It provides concise and accurate summaries of books in a way that is easy to understand. It's also very user-friendly and intuitive.",
  },
  {
    name: "Nathan S.",
    text: "This app is a great way to get the main takeaways from a book without having to read the entire thing. The summaries are well-written and informative. Definitely worth downloading.",
  },
  {
    name: "Ryan R.",
    text: "If you're a busy person who loves reading but doesn't have the time to read every book in full, this app is for you! The summaries are thorough and provide a great overview of the book's content.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="testimonials">
      <div className="container">
        <div className="row">
          <h2 className="section__title">What our members say</h2>

          <div className="testimonials__list">
            {testimonials.map((testimonial) => (
              <div className="testimonial" key={testimonial.name}>
                <div className="testimonial__header">
                  <span className="testimonial__name">{testimonial.name}</span>
                  <span className="testimonial__stars">★★★★★</span>
                </div>

                <p className="testimonial__text">{testimonial.text}</p>
              </div>
            ))}
          </div>

          <button className="btn testimonials__btn">Login</button>
        </div>
      </div>
    </section>
  );
}