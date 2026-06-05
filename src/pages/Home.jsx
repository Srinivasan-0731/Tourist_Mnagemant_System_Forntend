import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ── Placeholder image URLs (Unsplash free-to-use) ── */
const HERO_IMG =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80";
const DEST_IMGS = [
  "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=300&q=70",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=70",
  "https://images.unsplash.com/photo-1542259009477-d625272157b7?w=300&q=70",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&q=70",
];
const PLAN_CARDS = [
  { city: "Rome, Italy",    price: "$746k", days: "7 Day Trip", rating: 4.5, img: "https://images.unsplash.com/photo-1529260830199-42c24126f198?w=400&q=70" },
  { city: "India, Delhi",   price: "$746k", days: "7 Day Trip", rating: 4.5, img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=70" },
  { city: "USA, Chicago",   price: "$746k", days: "7 Day Trip", rating: 4.5, img: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=70" },
  { city: "UK, London",     price: "$746k", days: "7 Day Trip", rating: 4.5, img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=70" },
];
const BLOG_IMG =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=70";
const MOBILE_BG =
  "https://images.unsplash.com/photo-1544644181-1484b3fdfc32?w=600&q=70";

/* ── Star renderer ── */
const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  return (
    <span className="stars">
      {"★".repeat(full)}{"☆".repeat(5 - full)}
    </span>
  );
};

const Home = () => {
  const [search, setSearch] = useState("");

  /* fade-in on scroll */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("visible", e.isIntersecting)),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --navy: #0d1b3e;
          --accent: #1a73e8;
          --red: #e94560;
          --light: #f4f7ff;
          --white: #ffffff;
          --text: #333d4e;
          --muted: #7a8599;
          --card-shadow: 0 8px 32px rgba(13,27,62,0.10);
        }

        body { font-family: 'DM Sans', sans-serif; background: var(--white); color: var(--text); }

        /* ── reveal animation ── */
        .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .reveal.visible { opacity: 1; transform: none; }

        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          background: var(--white);
          display: flex;
          align-items: center;
          padding: 100px 6vw 60px;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 520px; height: 520px;
          border-radius: 50%;
          background: radial-gradient(circle, #dce9ff 0%, transparent 70%);
          z-index: 0;
        }
        .hero__inner {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .hero__badge {
          display: inline-block;
          background: #e8f0fe;
          color: var(--accent);
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.35rem 1rem;
          border-radius: 100px;
          margin-bottom: 1.25rem;
        }
        .hero__title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.4rem, 5vw, 3.8rem);
          font-weight: 800;
          line-height: 1.15;
          color: var(--navy);
          margin-bottom: 1.25rem;
        }
        .hero__title span { color: var(--accent); }
        .hero__sub {
          color: var(--muted);
          font-size: 1rem;
          line-height: 1.7;
          max-width: 420px;
          margin-bottom: 2.25rem;
        }
        .hero__btns { display: flex; gap: 1rem; flex-wrap: wrap; }
        .btn-primary {
          padding: 0.75rem 1.8rem;
          background: var(--navy);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s;
          display: inline-flex; align-items: center; gap: 0.4rem;
        }
        .btn-primary:hover { background: var(--accent); transform: translateY(-2px); }
        .btn-ghost {
          padding: 0.75rem 1.8rem;
          background: transparent;
          color: var(--navy);
          border: 1.5px solid #c8d4ee;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
          display: inline-flex; align-items: center; gap: 0.4rem;
        }
        .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }

        /* hero image blob */
        .hero__img-wrap {
          position: relative;
          display: flex;
          justify-content: center;
        }
        .hero__blob {
          width: 380px; height: 380px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c8e3ff, #e8f0fe);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(26,115,232,0.18);
          animation: float 4s ease-in-out infinite;
        }
        .hero__blob img { width: 100%; height: 100%; object-fit: cover; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }

        /* booking card */
        .booking-card {
          background: var(--white);
          border-radius: 18px;
          box-shadow: var(--card-shadow);
          padding: 1.5rem 2rem;
          max-width: 440px;
          margin: 4rem auto 0;
        }
        .booking-card__row { display: flex; gap: 1.5rem; margin-bottom: 1rem; }
        .booking-card__field label { font-size: 0.75rem; color: var(--muted); font-weight: 600; display: block; margin-bottom: 0.25rem; }
        .booking-card__field p { font-size: 0.92rem; font-weight: 600; color: var(--navy); }
        .booking-card__actions { display: flex; gap: 1rem; margin-top: 1.25rem; }
        .btn-outline-navy {
          padding: 0.6rem 1.4rem;
          border: 1.5px solid var(--navy);
          border-radius: 8px;
          background: transparent;
          color: var(--navy);
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }
        .btn-outline-navy:hover { background: var(--navy); color: #fff; }

        /* ── SECTION COMMONS ── */
        section { padding: 5rem 6vw; }
        .section-header { text-align: center; margin-bottom: 2.5rem; }
        .section-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          color: var(--navy);
          margin-bottom: 0.6rem;
        }
        .section-header h2 strong { color: var(--accent); font-style: italic; }
        .section-header p { color: var(--muted); font-size: 0.95rem; }

        /* ── DESTINATIONS ── */
        .destinations { background: var(--light); }
        .search-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--white);
          border: 1.5px solid #d0dcf0;
          border-radius: 12px;
          padding: 0.65rem 1.2rem;
          max-width: 420px;
          margin: 0 auto 2.5rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }
        .search-bar input {
          border: none; outline: none;
          font-size: 0.92rem;
          color: var(--text);
          flex: 1;
          background: transparent;
        }
        .search-bar span { color: var(--muted); font-size: 1.1rem; }
        .dest-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          max-width: 1100px;
          margin: 0 auto 2rem;
        }
        .dest-card {
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          aspect-ratio: 3/4;
          cursor: pointer;
          box-shadow: var(--card-shadow);
          transition: transform 0.3s;
        }
        .dest-card:hover { transform: translateY(-6px) scale(1.02); }
        .dest-card img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .dest-card__label {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.65));
          padding: 1.5rem 1rem 1rem;
          color: #fff;
          font-weight: 700;
          font-size: 1rem;
        }
        .see-more {
          display: block;
          text-align: center;
          color: var(--navy);
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: underline;
          cursor: pointer;
          margin-top: 0.5rem;
        }

        /* ── VACATION PLANS ── */
        .plans-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          max-width: 1100px;
          margin: 0 auto 2rem;
        }
        .plan-card {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--card-shadow);
          background: var(--white);
          transition: transform 0.3s;
        }
        .plan-card:hover { transform: translateY(-6px); }
        .plan-card img { width: 100%; height: 200px; object-fit: cover; display: block; }
        .plan-card__body { padding: 0.9rem 1rem; }
        .plan-card__top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; }
        .plan-card__city { font-weight: 700; font-size: 0.95rem; color: var(--navy); }
        .plan-card__price { font-weight: 700; color: var(--accent); font-size: 0.95rem; }
        .plan-card__meta { display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--muted); }
        .stars { color: #f5a623; font-size: 0.78rem; }

        /* ── BLOG ── */
        .blog { background: var(--light); }
        .blog__inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
        }
        .blog__img {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: var(--card-shadow);
        }
        .blog__img img { width: 100%; display: block; height: 340px; object-fit: cover; }
        .blog__content h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          color: var(--navy);
          margin-bottom: 1rem;
        }
        .blog__content p { color: var(--muted); line-height: 1.8; margin-bottom: 1.5rem; }
        .read-more {
          color: var(--accent);
          font-weight: 600;
          font-size: 0.92rem;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 0.3rem;
        }
        .read-more:hover { text-decoration: underline; }

        /* ── APP SECTION ── */
        .app-section {
          background: var(--white);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          max-width: 1100px;
          margin: 0 auto;
        }
        .app-section__text h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          color: var(--navy);
          line-height: 1.2;
          margin-bottom: 1.2rem;
        }
        .app-section__text p { color: var(--muted); line-height: 1.8; margin-bottom: 2rem; }
        .app-section__img {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(13,27,62,0.14);
        }
        .app-section__img img { width: 100%; display: block; height: 400px; object-fit: cover; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .hero__inner, .blog__inner, .app-section { grid-template-columns: 1fr; }
          .dest-grid, .plans-grid { grid-template-columns: repeat(2, 1fr); }
          .hero__blob { width: 280px; height: 280px; }
        }
        @media (max-width: 560px) {
          .dest-grid, .plans-grid { grid-template-columns: 1fr 1fr; }
          section { padding: 3.5rem 5vw; }
        }
      `}</style>

      <Navbar />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__left reveal">
            <span className="hero__badge">✈ Explore The World</span>
            <h1 className="hero__title">
              Travel Memories<br />
              You'll <span>Never Forget</span>
            </h1>
            <p className="hero__sub">
              Discover breathtaking destinations around the world. Let us turn your wanderlust into unforgettable adventures.
            </p>
            <div className="hero__btns">
              <Link to="/destinations" className="btn-primary">Find Out More</Link>
              <a href="#plans" className="btn-ghost">▶ Play Demo</a>
            </div>
          </div>

          <div className="hero__img-wrap reveal" style={{ animationDelay: "0.2s" }}>
            <div className="hero__blob">
              <img src={HERO_IMG} alt="Travel" />
            </div>
          </div>
        </div>

        {/* booking card */}
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
          <div className="booking-card reveal">
            <div className="booking-card__row">
              <div className="booking-card__field">
                <label>📍 Location</label>
                <p>Arizona, Phoenix</p>
              </div>
              <div className="booking-card__field">
                <label>📅 Date</label>
                <p>25 Sept 2025</p>
              </div>
              <div className="booking-card__field">
                <label>💰 Price</label>
                <p>$100 – $500</p>
              </div>
            </div>
            <div className="booking-card__actions">
              <a href="#" className="btn-outline-navy">Preview Hotel</a>
              <Link to="/destinations" className="btn-primary">Book Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section className="destinations">
        <div className="section-header reveal">
          <h2>Find Your <strong>Best</strong> Destination</h2>
          <p>We have more than 2000 destinations you can choose</p>
        </div>
        <div className="search-bar reveal">
          <span>📍</span>
          <input
            type="text"
            placeholder="Search Destination"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span>🔍</span>
        </div>
        <div className="dest-grid">
          {DEST_IMGS.map((img, i) => (
            <div className="dest-card reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
              <img src={img} alt={`destination-${i}`} />
              <div className="dest-card__label">
                {["Alps, Europe", "Amazon Forest", "Santorini, GR", "Himalayas"][i]}
              </div>
            </div>
          ))}
        </div>
        <Link to="/destinations" className="see-more reveal">See more</Link>
      </section>

      {/* ── VACATION PLANS ── */}
      <section id="plans">
        <div className="section-header reveal">
          <h2><strong>Best</strong> Vacation Plan</h2>
          <p>Plan your perfect vacation with our travel agency. Choose among hundreds of all-inclusive offers!</p>
        </div>
        <div className="plans-grid">
          {PLAN_CARDS.map((card, i) => (
            <div className="plan-card reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
              <img src={card.img} alt={card.city} />
              <div className="plan-card__body">
                <div className="plan-card__top">
                  <span className="plan-card__city">{card.city}</span>
                  <span className="plan-card__price">{card.price}</span>
                </div>
                <div className="plan-card__meta">
                  <span>✈ {card.days}</span>
                  <Stars rating={card.rating} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <Link to="/destinations" className="see-more reveal">See more</Link>
      </section>

      {/* ── BLOG ── */}
      <section className="blog">
        <div className="section-header reveal">
          <h2>Our <strong>Blog</strong></h2>
          <p>An insight into the incredible experience in the world</p>
        </div>
        <div className="blog__inner">
          <div className="blog__img reveal">
            <img src={BLOG_IMG} alt="Kashmir" />
          </div>
          <div className="blog__content reveal" style={{ transitionDelay: "0.15s" }}>
            <h3>Beautiful Kashmir — Let's Travel</h3>
            <p>
              We are ready to help you build and realize the room design that you dream of, with our experts and the best category recommendations crafted just for you.
            </p>
            <a href="#" className="read-more">Read more →</a>
          </div>
        </div>
      </section>

      {/* ── APP / CTA ── */}
      <section>
        <div className="app-section">
          <div className="app-section__text reveal">
            <h2>We Make World Travel Easy</h2>
            <p>
              Navigating the globe effortlessly — we transform wanderlust dreams into seamless adventures. With us, the world becomes your accessible playground, travel simplified.
            </p>
            <Link to="/destinations" className="btn-primary">Explore Our Tour →</Link>
          </div>
          <div className="app-section__img reveal" style={{ transitionDelay: "0.15s" }}>
            <img src={MOBILE_BG} alt="Travel App" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;