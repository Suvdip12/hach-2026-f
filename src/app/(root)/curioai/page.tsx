"use client";

import "./curioai.css";
import Navbar from "@/component/organisms/Navbar";
import { useTranslation } from "@/i18n";
import { showToast } from "@/lib/toast.config";

export default function EasyAIPage() {
  const { t } = useTranslation();

  const showEnrollmentModal = () => {
    showToast.custom(
      "Enrollment modal would open here. This would be connected to your enrollment system.",
    );
  };

  return (
    <div className="curio-ai-page">
      {/* Navbar */}
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="hero__content">
              <div className="hero__text">
                <h1 className="hero__title">{t("curioAIPage.heroTitle")}</h1>
                <p className="hero__subtitle">
                  {t("curioAIPage.heroSubtitle")}
                </p>
                <p className="hero__description">
                  {t("curioAIPage.heroDescription")}
                </p>

                <div className="hero__meta">
                  <div className="hero__meta-item">
                    <span className="hero__meta-label">
                      {t("curioAIPage.ageRange")}
                    </span>
                    <span className="hero__meta-value">
                      {t("curioAIPage.agesValue")}
                    </span>
                  </div>
                  <div className="hero__meta-item">
                    <span className="hero__meta-label">
                      {t("curioAIPage.duration")}
                    </span>
                    <span className="hero__meta-value">
                      {t("curioAIPage.durationValue")}
                    </span>
                  </div>
                  <div className="hero__meta-item">
                    <span className="hero__meta-label">
                      {t("curioAIPage.format")}
                    </span>
                    <span className="hero__meta-value">
                      {t("curioAIPage.formatValue")}
                    </span>
                  </div>
                </div>

                {/* <div className="hero__stats">
                <div className="hero__stat">
                  <span className="hero__stat-number">2,847</span>
                  <span className="hero__stat-label">Students Enrolled</span>
                </div>
                <div className="hero__stat">
                  <div className="rating">
                    <span className="rating__number">4.8</span>
                    <div className="rating__stars">
                      <span className="star star--filled">★</span>
                      <span className="star star--filled">★</span>
                      <span className="star star--filled">★</span>
                      <span className="star star--filled">★</span>
                      <span className="star star--filled">★</span>
                    </div>
                    <span className="rating__count">(1,247 reviews)</span>
                  </div>
                </div>
              </div> */}

                <button
                  className="btn btn--primary btn--lg hero__cta"
                  onClick={showEnrollmentModal}
                >
                  {t("curioAIPage.enrollNow")}
                </button>
              </div>
              <div className="hero__visual">
                <div className="hero__icon">🤖</div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Overview */}
        <section className="overview">
          <div className="container">
            <h2 className="overview__title">
              {t("curioAIPage.overviewTitle")}
            </h2>
            <p className="overview__description">
              {t("curioAIPage.overviewDescription")}
            </p>

            <div className="journey">
              <div className="journey__path">
                <div className="journey__stage">
                  {t("curioAIPage.curiosity")}
                </div>
                <div className="journey__arrow">→</div>
                <div className="journey__stage">
                  {t("curioAIPage.creativity")}
                </div>
                <div className="journey__arrow">→</div>
                <div className="journey__stage">{t("curioAIPage.python")}</div>
                <div className="journey__arrow">→</div>
                <div className="journey__stage">
                  {t("curioAIPage.appliedAI")}
                </div>
                <div className="journey__arrow">→</div>
                <div className="journey__stage">
                  {t("curioAIPage.realWorldProjects")}
                </div>
                <div className="journey__arrow">→</div>
                <div className="journey__stage">
                  {t("curioAIPage.aiLeadership")}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6-Stage Curriculum */}
        <section className="curriculum">
          <div className="container">
            <h2 className="curriculum__title">
              {t("curioAIPage.curriculumTitle")}
            </h2>
            <p className="curriculum__description">
              {t("curioAIPage.curriculumDescription")}
            </p>

            <div className="stages">
              <div className="stage" data-stage="1">
                <div className="stage__header">
                  <div className="stage__number">01</div>
                  <div className="stage__icon">💡</div>
                  <div className="stage__title-group">
                    <h3 className="stage__title">
                      {t("curioAIPage.stage1Title")}
                    </h3>
                    <p className="stage__subtitle">
                      {t("curioAIPage.stage1Subtitle")}
                    </p>
                  </div>
                </div>
                <div className="stage__content">
                  <div className="stage__age">{t("curioAIPage.stage1Age")}</div>
                  <p className="stage__description">
                    {t("curioAIPage.stage1Description")}
                  </p>
                  <div className="stage__milestone">
                    <strong>{t("curioAIPage.keyMilestone")}</strong>{" "}
                    {t("curioAIPage.stage1Milestone")}
                  </div>
                  <div className="stage__duration">
                    {t("curioAIPage.stage1Duration")}
                  </div>
                  <div className="stage__activities">
                    <h4>{t("curioAIPage.activities")}</h4>
                    <ul>
                      {t("curioAIPage.stage1Activities")
                        .split(", ")
                        .map((activity: string, i: number) => (
                          <li key={i}>{activity}</li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="stage" data-stage="2">
                <div className="stage__header">
                  <div className="stage__number">02</div>
                  <div className="stage__icon">🎨</div>
                  <div className="stage__title-group">
                    <h3 className="stage__title">
                      {t("curioAIPage.stage2Title")}
                    </h3>
                    <p className="stage__subtitle">
                      {t("curioAIPage.stage2Subtitle")}
                    </p>
                  </div>
                </div>
                <div className="stage__content">
                  <div className="stage__age">{t("curioAIPage.stage2Age")}</div>
                  <p className="stage__description">
                    {t("curioAIPage.stage2Description")}
                  </p>
                  <div className="stage__milestone">
                    <strong>{t("curioAIPage.keyMilestone")}</strong>{" "}
                    {t("curioAIPage.stage2Milestone")}
                  </div>
                  <div className="stage__duration">
                    {t("curioAIPage.stage2Duration")}
                  </div>
                  <div className="stage__activities">
                    <h4>{t("curioAIPage.activities")}</h4>
                    <ul>
                      {t("curioAIPage.stage2Activities")
                        .split(", ")
                        .map((activity: string, i: number) => (
                          <li key={i}>{activity}</li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="stage" data-stage="3">
                <div className="stage__header">
                  <div className="stage__number">03</div>
                  <div className="stage__icon">💻</div>
                  <div className="stage__title-group">
                    <h3 className="stage__title">
                      {t("curioAIPage.stage3Title")}
                    </h3>
                    <p className="stage__subtitle">
                      {t("curioAIPage.stage3Subtitle")}
                    </p>
                  </div>
                </div>
                <div className="stage__content">
                  <div className="stage__age">{t("curioAIPage.stage3Age")}</div>
                  <p className="stage__description">
                    {t("curioAIPage.stage3Description")}
                  </p>
                  <div className="stage__milestone">
                    <strong>{t("curioAIPage.keyMilestone")}</strong>{" "}
                    {t("curioAIPage.stage3Milestone")}
                  </div>
                  <div className="stage__duration">
                    {t("curioAIPage.stage3Duration")}
                  </div>
                  <div className="stage__activities">
                    <h4>{t("curioAIPage.activities")}</h4>
                    <ul>
                      {t("curioAIPage.stage3Activities")
                        .split(", ")
                        .map((activity: string, i: number) => (
                          <li key={i}>{activity}</li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="stage" data-stage="4">
                <div className="stage__header">
                  <div className="stage__number">04</div>
                  <div className="stage__icon">🤖</div>
                  <div className="stage__title-group">
                    <h3 className="stage__title">
                      {t("curioAIPage.stage4Title")}
                    </h3>
                    <p className="stage__subtitle">
                      {t("curioAIPage.stage4Subtitle")}
                    </p>
                  </div>
                </div>
                <div className="stage__content">
                  <div className="stage__age">{t("curioAIPage.stage4Age")}</div>
                  <p className="stage__description">
                    {t("curioAIPage.stage4Description")}
                  </p>
                  <div className="stage__milestone">
                    <strong>{t("curioAIPage.keyMilestone")}</strong>{" "}
                    {t("curioAIPage.stage4Milestone")}
                  </div>
                  <div className="stage__duration">
                    {t("curioAIPage.stage4Duration")}
                  </div>
                  <div className="stage__activities">
                    <h4>{t("curioAIPage.activities")}</h4>
                    <ul>
                      {t("curioAIPage.stage4Activities")
                        .split(", ")
                        .map((activity: string, i: number) => (
                          <li key={i}>{activity}</li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="stage" data-stage="5">
                <div className="stage__header">
                  <div className="stage__number">05</div>
                  <div className="stage__icon">🚀</div>
                  <div className="stage__title-group">
                    <h3 className="stage__title">
                      {t("curioAIPage.stage5Title")}
                    </h3>
                    <p className="stage__subtitle">
                      {t("curioAIPage.stage5Subtitle")}
                    </p>
                  </div>
                </div>
                <div className="stage__content">
                  <div className="stage__age">{t("curioAIPage.stage5Age")}</div>
                  <p className="stage__description">
                    {t("curioAIPage.stage5Description")}
                  </p>
                  <div className="stage__milestone">
                    <strong>{t("curioAIPage.keyMilestone")}</strong>{" "}
                    {t("curioAIPage.stage5Milestone")}
                  </div>
                  <div className="stage__duration">
                    {t("curioAIPage.stage5Duration")}
                  </div>
                  <div className="stage__activities">
                    <h4>{t("curioAIPage.activities")}</h4>
                    <ul>
                      {t("curioAIPage.stage5Activities")
                        .split(", ")
                        .map((activity: string, i: number) => (
                          <li key={i}>{activity}</li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="stage" data-stage="6">
                <div className="stage__header">
                  <div className="stage__number">06</div>
                  <div className="stage__icon">👑</div>
                  <div className="stage__title-group">
                    <h3 className="stage__title">
                      {t("curioAIPage.stage6Title")}
                    </h3>
                    <p className="stage__subtitle">
                      {t("curioAIPage.stage6Subtitle")}
                    </p>
                  </div>
                </div>
                <div className="stage__content">
                  <div className="stage__age">{t("curioAIPage.stage6Age")}</div>
                  <p className="stage__description">
                    {t("curioAIPage.stage6Description")}
                  </p>
                  <div className="stage__milestone">
                    <strong>{t("curioAIPage.keyMilestone")}</strong>{" "}
                    {t("curioAIPage.stage6Milestone")}
                  </div>
                  <div className="stage__duration">
                    {t("curioAIPage.stage6Duration")}
                  </div>
                  <div className="stage__activities">
                    <h4>{t("curioAIPage.activities")}</h4>
                    <ul>
                      {t("curioAIPage.stage6Activities")
                        .split(", ")
                        .map((activity: string, i: number) => (
                          <li key={i}>{activity}</li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <div className="container">
            <h2 className="features__title">
              {t("curioAIPage.whyChooseTitle")}
            </h2>
            <div className="features__grid">
              <div className="feature">
                <div className="feature__icon">🧠</div>
                <h3 className="feature__title">
                  {t("curioAIPage.feature1Title")}
                </h3>
                <p className="feature__description">
                  {t("curioAIPage.feature1Desc")}
                </p>
              </div>
              <div className="feature">
                <div className="feature__icon">🔄</div>
                <h3 className="feature__title">
                  {t("curioAIPage.feature2Title")}
                </h3>
                <p className="feature__description">
                  {t("curioAIPage.feature2Desc")}
                </p>
              </div>
              <div className="feature">
                <div className="feature__icon">📊</div>
                <h3 className="feature__title">
                  {t("curioAIPage.feature3Title")}
                </h3>
                <p className="feature__description">
                  {t("curioAIPage.feature3Desc")}
                </p>
              </div>
              <div className="feature">
                <div className="feature__icon">⚡</div>
                <h3 className="feature__title">
                  {t("curioAIPage.feature4Title")}
                </h3>
                <p className="feature__description">
                  {t("curioAIPage.feature4Desc")}
                </p>
              </div>
              <div className="feature">
                <div className="feature__icon">👥</div>
                <h3 className="feature__title">
                  {t("curioAIPage.feature5Title")}
                </h3>
                <p className="feature__description">
                  {t("curioAIPage.feature5Desc")}
                </p>
              </div>
              <div className="feature">
                <div className="feature__icon">🎯</div>
                <h3 className="feature__title">
                  {t("curioAIPage.feature6Title")}
                </h3>
                <p className="feature__description">
                  {t("curioAIPage.feature6Desc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {/* <section className="testimonials">
        <div className="container">
          <h2 className="testimonials__title">What Our Students Say</h2>
          <div className="testimonials__grid">
            <div className="testimonial">
              <div className="testimonial__quote">
                &ldquo;EasyAI helped me understand how AI really works. Now
                I&rsquo;m building my own chatbot!&rdquo;
              </div>
              <div className="testimonial__author">
                <div className="testimonial__avatar">P</div>
                <div className="testimonial__info">
                  <div className="testimonial__name">Priya Sharma</div>
                  <div className="testimonial__details">
                    Age 14 • Applied AI Stage
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial__quote">
                &ldquo;The progression from curiosity to actual AI development
                was amazing. I feel ready for any tech career now.&rdquo;
              </div>
              <div className="testimonial__author">
                <div className="testimonial__avatar">A</div>
                <div className="testimonial__info">
                  <div className="testimonial__name">Arjun Patel</div>
                  <div className="testimonial__details">
                    Age 16 • AI Leadership Stage
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial__quote">
                &ldquo;I never thought I could create AI art and stories. This
                course made it so much fun!&rdquo;
              </div>
              <div className="testimonial__author">
                <div className="testimonial__avatar">S</div>
                <div className="testimonial__info">
                  <div className="testimonial__name">Sneha Gupta</div>
                  <div className="testimonial__details">
                    Age 13 • Creativity Stage
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

        {/* Instructor Section */}
        <section className="instructor">
          <div className="container">
            <div className="instructor__content">
              <div className="instructor__avatar">CT</div>
              <div className="instructor__info">
                <h2 className="instructor__name">
                  {t("curioAIPage.instructorName")}
                </h2>
                <p className="instructor__bio">
                  {t("curioAIPage.instructorBio")}
                </p>
                <p className="instructor__credentials">
                  {t("curioAIPage.instructorCredentials")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section
      <section className="pricing">
        <div className="container">
          <div className="pricing__card">
            <h2 className="pricing__title">Ready to Start Your AI Journey?</h2>
            <div className="pricing__price">
              <span className="pricing__original">₹19,999</span>
              <span className="pricing__current">₹15,999</span>
            </div>
            <div className="pricing__features">
              <div className="pricing__feature">✓ 120+ hours of content</div>
              <div className="pricing__feature">✓ 60 live classes</div>
              <div className="pricing__feature">✓ 25+ hands-on projects</div>
              <div className="pricing__feature">✓ 6 stage certificates</div>
              <div className="pricing__feature">✓ Industry mentor support</div>
              <div className="pricing__feature">✓ Portfolio development</div>
            </div>
            <button
              className="btn btn--primary btn--lg pricing__cta"
              onClick={showEnrollmentModal}
            >
              Enroll Now
            </button>
            <div className="pricing__guarantee">
              30-day money-back guarantee
            </div>
          </div>
        </div>
      </section> */}

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer__content">
              <div className="footer__brand">
                <span className="footer__logo">CT</span>
                <span className="footer__brand-text">EasyCode</span>
              </div>
              <p className="footer__text">{t("curioAIPage.footerText")}</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
