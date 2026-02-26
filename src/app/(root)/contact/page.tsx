"use client";

import "./contact.css";
import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import Navbar from "@/component/organisms/Navbar";
import { useTranslation } from "@/i18n";
import { showToast } from "@/lib/toast.config";

export default function ContactPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("school-demo");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [parentValidationErrors, setParentValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [technicalValidationErrors, setTechnicalValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [formData, setFormData] = useState({
    fullName: "",
    jobTitle: "",
    schoolName: "",
    email: "",
    phone: "",
    students: "",
    visualCoding: false,
    textBasedProgramming: false,
    roboticsHardware: false,
    webDevelopment: false,
    currentChallenges: "",
    preferredDemoTime: "morning",
    howDidYouHear: "",
    additionalComments: "",
  });

  const [parentFormData, setParentFormData] = useState({
    parentName: "",
    email: "",
    childAge: "",
    codingExperience: "no-experience",
    gamesDevelopment: false,
    webDesign: false,
    robotics: false,
    artificialIntelligence: false,
    selfPacedLearning: false,
    structuredLessons: false,
    collaborativeProjects: false,
    learningGoals: "",
  });

  const [technicalFormData, setTechnicalFormData] = useState({
    name: "",
    email: "",
    schoolOrganization: "",
    userType: "",
    issueCategory: "",
    issueDescription: "",
    priorityLevel: "medium",
  });

  // Validation functions
  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePhone = (phone: string): string => {
    if (!phone) return "Phone number is required";

    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, "");

    if (digitsOnly.length !== 10) {
      return "Phone number must be exactly 10 digits";
    }

    return "";
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Real-time validation for email and phone
    if (name === "email") {
      const error = validateEmail(value);
      setValidationErrors((prev) => ({
        ...prev,
        email: error,
      }));
    }

    if (name === "phone") {
      const error = validatePhone(value);
      setValidationErrors((prev) => ({
        ...prev,
        phone: error,
      }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      students: value,
    }));
  };

  const handleDemoTimeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredDemoTime: value,
    }));
  };

  const handleSourceChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      howDidYouHear: value,
    }));
  };

  const handleParentInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setParentFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear validation error when user starts typing
    if (parentValidationErrors[name]) {
      setParentValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Real-time validation for email
    if (name === "email") {
      const error = validateEmail(value);
      setParentValidationErrors((prev) => ({
        ...prev,
        email: error,
      }));
    }
  };

  const handleChildAgeChange = (value: string) => {
    setParentFormData((prev) => ({
      ...prev,
      childAge: value,
    }));
  };

  const onParentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors: { [key: string]: string } = {};

    if (!parentFormData.email) {
      errors.email = "Email is required";
    } else {
      const emailError = validateEmail(parentFormData.email);
      if (emailError) errors.email = emailError;
    }

    setParentValidationErrors(errors);

    // Only submit if no errors
    if (Object.keys(errors).length === 0) {
      showToast.success("Form submitted successfully!");
    }
  };

  const handleTechnicalInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setTechnicalFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear validation error when user starts typing
    if (technicalValidationErrors[name]) {
      setTechnicalValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Real-time validation for email
    if (name === "email") {
      const error = validateEmail(value);
      setTechnicalValidationErrors((prev) => ({
        ...prev,
        email: error,
      }));
    }
  };

  const handleUserTypeChange = (value: string) => {
    setTechnicalFormData((prev) => ({
      ...prev,
      userType: value,
    }));
  };

  const handleIssueCategoryChange = (value: string) => {
    setTechnicalFormData((prev) => ({
      ...prev,
      issueCategory: value,
    }));
  };

  const onTechnicalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors: { [key: string]: string } = {};

    if (!technicalFormData.email) {
      errors.email = "Email is required";
    } else {
      const emailError = validateEmail(technicalFormData.email);
      if (emailError) errors.email = emailError;
    }

    setTechnicalValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      showToast.success("Form submitted successfully!");
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors: { [key: string]: string } = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else {
      const emailError = validateEmail(formData.email);
      if (emailError) errors.email = emailError;
    }

    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else {
      const phoneError = validatePhone(formData.phone);
      if (phoneError) errors.phone = phoneError;
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      showToast.success("Form submitted successfully!");
    }
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: t("contact.faq1Question"),
      answer: t("contact.faq1Answer"),
    },
    {
      question: t("contact.faq2Question"),
      answer: t("contact.faq2Answer"),
    },
    {
      question: t("contact.faq3Question"),
      answer: t("contact.faq3Answer"),
    },
    {
      question: t("contact.faq4Question"),
      answer: t("contact.faq4Answer"),
    },
  ];

  return (
    <div className="contact-hero">
      {/* Navbar */}
      <Navbar />

      <main className="contact-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">{t("contact.heroTitle")}</h1>
            <p className="hero-subtitle">{t("contact.heroSubtitle")}</p>
            <div className="hero-buttons">
              <button className="hero-btn demo-btn">
                📱 {t("contact.bookDemo")}
              </button>
              <button className="hero-btn support-btn">
                🛠️ {t("contact.getSupport")}
              </button>
              <button className="hero-btn call-btn">
                📞 {t("contact.callUs")}: 1-800-CURIOTECH
              </button>
            </div>
            <div className="hero-chat">
              <button className="hero-btn chat-btn">
                💬 {t("contact.liveChat")}
              </button>
            </div>
          </div>
        </div>

        <div className="contact-layout">
          {/* Left Side - Form */}
          <div className="form-section">
            <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
              <Tabs.List className="tabs-list">
                <Tabs.Trigger
                  value="school-demo"
                  className="tab-trigger school-demo-tab"
                >
                  🏫 {t("contact.schoolDemo")}
                  <span className="tab-subtitle">
                    {t("contact.forAdministrators")}
                  </span>
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="parent-info"
                  className="tab-trigger parent-info-tab"
                >
                  👨‍👩‍👧‍👦 {t("contact.parentEnquiry")}
                  <span className="tab-subtitle">
                    {t("contact.forFamilies")}
                  </span>
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="technical-help"
                  className="tab-trigger technical-help-tab"
                >
                  🔧 {t("contact.technicalSupport")}
                  <span className="tab-subtitle">
                    {t("contact.forExistingUsers")}
                  </span>
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="school-demo" className="tab-content">
                <div className="form-header">
                  <h2 className="form-title">{t("contact.schoolDemo")}</h2>
                  <p className="form-description">
                    {t("contact.scheduleDemo")}
                  </p>
                </div>

                <form onSubmit={onSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fullName">
                        {t("contact.fullName")} *
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="jobTitle">
                        {t("contact.jobTitle")} *
                      </label>
                      <input
                        id="jobTitle"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="schoolName">
                        {t("contact.schoolName")} *
                      </label>
                      <input
                        id="schoolName"
                        name="schoolName"
                        value={formData.schoolName}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">{t("contact.email")} *</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`form-input ${validationErrors.email ? "form-input-error" : ""}`}
                        required
                      />
                      {validationErrors.email && (
                        <span className="error-message">
                          {validationErrors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">{t("contact.phone")} *</label>
                      <input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`form-input ${validationErrors.phone ? "form-input-error" : ""}`}
                        required
                      />
                      {validationErrors.phone && (
                        <span className="error-message">
                          {validationErrors.phone}
                        </span>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="students">
                        {t("contact.numberOfStudents")}
                      </label>
                      <select
                        id="students"
                        name="students"
                        value={formData.students}
                        onChange={(e) => handleSelectChange(e.target.value)}
                        className="form-select"
                      >
                        <option value="">{t("contact.selectRange")}</option>
                        <option value="less-than-10">
                          {t("contact.lessThan10")}
                        </option>
                        <option value="1-50">
                          {t("contact.students1to50")}
                        </option>
                        <option value="51-200">
                          {t("contact.students51to200")}
                        </option>
                        <option value="201-500">
                          {t("contact.students201to500")}
                        </option>
                        <option value="500+">
                          {t("contact.students500plus")}
                        </option>
                        <option value="1000+">
                          {t("contact.students1000plus")}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>{t("contact.programInterests")}</label>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="visualCoding"
                          checked={formData.visualCoding}
                          onChange={handleInputChange}
                          className="checkbox-input"
                        />
                        <span className="checkbox-custom"></span>
                        {t("contact.visualCoding")}
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="textBasedProgramming"
                          checked={formData.textBasedProgramming}
                          onChange={handleInputChange}
                          className="checkbox-input"
                        />
                        <span className="checkbox-custom"></span>
                        {t("contact.textBasedProgramming")}
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="roboticsHardware"
                          checked={formData.roboticsHardware}
                          onChange={handleInputChange}
                          className="checkbox-input"
                        />
                        <span className="checkbox-custom"></span>
                        {t("contact.roboticsHardware")}
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="webDevelopment"
                          checked={formData.webDevelopment}
                          onChange={handleInputChange}
                          className="checkbox-input"
                        />
                        <span className="checkbox-custom"></span>
                        {t("contact.webDevelopment")}
                      </label>
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="currentChallenges">
                      {t("contact.currentChallenges")}
                    </label>
                    <textarea
                      id="currentChallenges"
                      name="currentChallenges"
                      value={formData.currentChallenges}
                      onChange={handleInputChange}
                      placeholder={t("contact.currentChallengesPlaceholder")}
                      className="form-textarea"
                      rows={4}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="preferredDemoTime">
                        {t("contact.preferredDemoTime")}
                      </label>
                      <select
                        id="preferredDemoTime"
                        name="preferredDemoTime"
                        value={formData.preferredDemoTime}
                        onChange={(e) => handleDemoTimeChange(e.target.value)}
                        className="form-select"
                      >
                        <option value="morning">
                          {t("contact.morningTime")}
                        </option>
                        <option value="midday">
                          {t("contact.middayTime")}
                        </option>
                        <option value="afternoon">
                          {t("contact.afternoonTime")}
                        </option>
                        <option value="evening">
                          {t("contact.eveningTime")}
                        </option>
                        <option value="weekend">
                          {t("contact.weekendTime")}
                        </option>
                        <option value="flexible">
                          {t("contact.flexibleTime")}
                        </option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="howDidYouHear">
                        {t("contact.howDidYouHear")}
                      </label>
                      <select
                        id="howDidYouHear"
                        name="howDidYouHear"
                        value={formData.howDidYouHear}
                        onChange={(e) => handleSourceChange(e.target.value)}
                        className="form-select"
                      >
                        <option value="">{t("contact.selectSource")}</option>
                        <option value="google">
                          {t("contact.googleSearch")}
                        </option>
                        <option value="referral">
                          {t("contact.referral")}
                        </option>
                        <option value="social-media">
                          {t("contact.socialMedia")}
                        </option>
                        <option value="conference">
                          {t("contact.conferenceEvent")}
                        </option>
                        <option value="newsletter">
                          {t("contact.newsletter")}
                        </option>
                        <option value="partner">
                          {t("contact.partnerAffiliate")}
                        </option>
                        <option value="other">{t("contact.other")}</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="additionalComments">
                      {t("contact.additionalComments")}
                    </label>
                    <textarea
                      id="additionalComments"
                      name="additionalComments"
                      value={formData.additionalComments}
                      onChange={handleInputChange}
                      className="form-textarea"
                      rows={3}
                    />
                  </div>

                  <button type="submit" className="submit-btn">
                    {t("contact.scheduleMyDemo")}
                  </button>

                  <div className="form-disclaimer">
                    <span className="disclaimer-icon">📧</span>
                    We&rsquo;ll contact you within 24 hours to confirm your demo
                  </div>
                </form>
              </Tabs.Content>

              <Tabs.Content value="parent-info" className="tab-content">
                <div className="form-header">
                  <h2 className="form-title">{t("contact.parentEnquiry")}</h2>
                  <p className="form-description">
                    {t("contact.techSupportDesc")}
                  </p>
                </div>

                <form onSubmit={onParentSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="parentName">
                        {t("contact.parentName")} *
                      </label>
                      <input
                        id="parentName"
                        name="parentName"
                        value={parentFormData.parentName}
                        onChange={handleParentInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="parentEmail">
                        {t("contact.email")} *
                      </label>
                      <input
                        id="parentEmail"
                        name="email"
                        type="email"
                        value={parentFormData.email}
                        onChange={handleParentInputChange}
                        className={`form-input ${parentValidationErrors.email ? "form-input-error" : ""}`}
                        required
                      />
                      {parentValidationErrors.email && (
                        <span className="error-message">
                          {parentValidationErrors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="childAge">{t("contact.childAge")} *</label>
                    <select
                      id="childAge"
                      name="childAge"
                      value={parentFormData.childAge}
                      onChange={(e) => handleChildAgeChange(e.target.value)}
                      className="form-select"
                      required
                    >
                      <option value="">{t("contact.selectAge")}</option>
                      <option value="7-or-below">
                        7 {t("contact.years")} or below
                      </option>
                      <option value="8-9">8-9 {t("contact.years")}</option>
                      <option value="10-11">10-11 {t("contact.years")}</option>
                      <option value="12-13">12-13 {t("contact.years")}</option>
                      <option value="14-16">14-16 {t("contact.years")}</option>
                      <option value="17-plus">
                        17 {t("contact.years")} or older
                      </option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>{t("contact.codingExperience")}</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="codingExperience"
                          value="no-experience"
                          checked={
                            parentFormData.codingExperience === "no-experience"
                          }
                          onChange={handleParentInputChange}
                          className="radio-input"
                        />
                        <span className="radio-custom"></span>
                        {t("contact.noExperience")}
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="codingExperience"
                          value="some-experience"
                          checked={
                            parentFormData.codingExperience ===
                            "some-experience"
                          }
                          onChange={handleParentInputChange}
                          className="radio-input"
                        />
                        <span className="radio-custom"></span>
                        {t("contact.someExperience")}
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="codingExperience"
                          value="intermediate"
                          checked={
                            parentFormData.codingExperience === "intermediate"
                          }
                          onChange={handleParentInputChange}
                          className="radio-input"
                        />
                        <span className="radio-custom"></span>
                        {t("contact.experiencedCoder")}
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="codingExperience"
                          value="advanced"
                          checked={
                            parentFormData.codingExperience === "advanced"
                          }
                          onChange={handleParentInputChange}
                          className="radio-input"
                        />
                        <span className="radio-custom"></span>
                        {t("contact.experiencedCoder")}
                      </label>
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>{t("contact.areasOfInterest")}</label>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="gamesDevelopment"
                          checked={parentFormData.gamesDevelopment}
                          onChange={handleParentInputChange}
                          className="checkbox-input"
                        />
                        <span className="checkbox-custom"></span>
                        {t("contact.gamesDevelopment")}
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="webDesign"
                          checked={parentFormData.webDesign}
                          onChange={handleParentInputChange}
                          className="checkbox-input"
                        />
                        <span className="checkbox-custom"></span>
                        {t("contact.webDesign")}
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="robotics"
                          checked={parentFormData.robotics}
                          onChange={handleParentInputChange}
                          className="checkbox-input"
                        />
                        <span className="checkbox-custom"></span>
                        {t("contact.robotics")}
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="artificialIntelligence"
                          checked={parentFormData.artificialIntelligence}
                          onChange={handleParentInputChange}
                          className="checkbox-input"
                        />
                        <span className="checkbox-custom"></span>
                        {t("contact.artificialIntelligence")}
                      </label>
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>{t("contact.learningPreferences")}</label>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="selfPacedLearning"
                          checked={parentFormData.selfPacedLearning}
                          onChange={handleParentInputChange}
                          className="checkbox-input"
                        />
                        <span className="checkbox-custom"></span>
                        {t("contact.selfPacedLearning")}
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="structuredLessons"
                          checked={parentFormData.structuredLessons}
                          onChange={handleParentInputChange}
                          className="checkbox-input"
                        />
                        <span className="checkbox-custom"></span>
                        {t("contact.structuredLessons")}
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="collaborativeProjects"
                          checked={parentFormData.collaborativeProjects}
                          onChange={handleParentInputChange}
                          className="checkbox-input"
                        />
                        <span className="checkbox-custom"></span>
                        {t("contact.collaborativeProjects")}
                      </label>
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="learningGoals">
                      {t("contact.learningGoals")}
                    </label>
                    <textarea
                      id="learningGoals"
                      name="learningGoals"
                      value={parentFormData.learningGoals}
                      onChange={handleParentInputChange}
                      placeholder={t("contact.learningGoalsPlaceholder")}
                      className="form-textarea"
                      rows={4}
                    />
                  </div>

                  <button
                    type="submit"
                    className="submit-btn parent-submit-btn"
                  >
                    {t("contact.getPersonalizedInfo")}
                  </button>

                  <div className="form-disclaimer">
                    <span className="disclaimer-icon">📚</span>
                    We&rsquo;ll send personalized learning recommendations
                    within 24 hours
                  </div>
                </form>
              </Tabs.Content>

              <Tabs.Content value="technical-help" className="tab-content">
                <div className="form-header">
                  <h2 className="form-title">
                    {t("contact.techSupportTitle")}
                  </h2>
                  <p className="form-description">
                    {t("contact.techSupportDesc")}
                  </p>
                </div>

                <form onSubmit={onTechnicalSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="techName">
                        {t("contact.yourName")} *
                      </label>
                      <input
                        id="techName"
                        name="name"
                        value={technicalFormData.name}
                        onChange={handleTechnicalInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="techEmail">{t("contact.email")} *</label>
                      <input
                        id="techEmail"
                        name="email"
                        type="email"
                        value={technicalFormData.email}
                        onChange={handleTechnicalInputChange}
                        className={`form-input ${technicalValidationErrors.email ? "form-input-error" : ""}`}
                        required
                      />
                      {technicalValidationErrors.email && (
                        <span className="error-message">
                          {technicalValidationErrors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="schoolOrganization">
                      {t("contact.schoolOrOrganization")}
                    </label>
                    <input
                      id="schoolOrganization"
                      name="schoolOrganization"
                      value={technicalFormData.schoolOrganization}
                      onChange={handleTechnicalInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="userType">{t("contact.iAmA")}</label>
                      <select
                        id="userType"
                        name="userType"
                        value={technicalFormData.userType}
                        onChange={(e) => handleUserTypeChange(e.target.value)}
                        className="form-select"
                      >
                        <option value="">{t("contact.selectUserType")}</option>
                        <option value="teacher">{t("contact.teacher")}</option>
                        <option value="administrator">
                          {t("contact.administrator")}
                        </option>
                        <option value="parent">{t("contact.parent")}</option>
                        <option value="student">{t("contact.student")}</option>
                        <option value="it-support">IT Support</option>
                        <option value="vendor">Vendor / Partner</option>
                        <option value="other-user">{t("contact.other")}</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="issueCategory">
                        {t("contact.issueCategory")}
                      </label>
                      <select
                        id="issueCategory"
                        name="issueCategory"
                        value={technicalFormData.issueCategory}
                        onChange={(e) =>
                          handleIssueCategoryChange(e.target.value)
                        }
                        className="form-select"
                      >
                        <option value="">{t("contact.selectCategory")}</option>
                        <option value="login-access">
                          {t("contact.loginAccess")}
                        </option>
                        <option value="platform-bugs">
                          {t("contact.technicalBugs")}
                        </option>
                        <option value="performance">Performance Issues</option>
                        <option value="features">
                          {t("contact.featureRequest")}
                        </option>
                        <option value="integration">Integration Support</option>
                        <option value="billing">
                          {t("contact.billingPayments")}
                        </option>
                        <option value="account-setup">Account Setup</option>
                        <option value="other">{t("contact.other")}</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="issueDescription">
                      {t("contact.describeIssue")} *
                    </label>
                    <textarea
                      id="issueDescription"
                      name="issueDescription"
                      value={technicalFormData.issueDescription}
                      onChange={handleTechnicalInputChange}
                      placeholder={t("contact.describeIssuePlaceholder")}
                      className="form-textarea"
                      rows={5}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>{t("contact.priorityLevel")}</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="priorityLevel"
                          value="low"
                          checked={technicalFormData.priorityLevel === "low"}
                          onChange={handleTechnicalInputChange}
                          className="radio-input"
                        />
                        <span className="radio-custom"></span>
                        {t("contact.lowPriority")}
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="priorityLevel"
                          value="medium"
                          checked={technicalFormData.priorityLevel === "medium"}
                          onChange={handleTechnicalInputChange}
                          className="radio-input"
                        />
                        <span className="radio-custom"></span>
                        {t("contact.mediumPriority")}
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="priorityLevel"
                          value="high"
                          checked={technicalFormData.priorityLevel === "high"}
                          onChange={handleTechnicalInputChange}
                          className="radio-input"
                        />
                        <span className="radio-custom"></span>
                        {t("contact.highPriority")}
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="submit-btn technical-submit-btn"
                  >
                    {t("contact.submitRequest")}
                  </button>

                  <div className="form-disclaimer">
                    <span className="disclaimer-icon">🛠️</span>
                    Support tickets are typically resolved within 24-48 hours
                  </div>
                </form>
              </Tabs.Content>
            </Tabs.Root>
          </div>

          {/* Right Side - Contact Information */}
          <div className="contact-info-sidebar">
            <h3 className="contact-info-title">{t("contact.sidebarTitle")}</h3>

            <div className="contact-info-group">
              <h4>Main Phone:</h4>
              <a href="tel:1-800-287-4683" className="contact-link">
                1-800-CURIOTECH (1-800-287-4683)
              </a>
            </div>

            <div className="contact-info-group">
              <h4>International:</h4>
              <a href="tel:1-555-123-4567" className="contact-link">
                1-555-123-4567
              </a>
            </div>

            <div className="contact-info-group">
              <h4>General:</h4>
              <a href="mailto:hello@curiotech.com" className="contact-link">
                hello@curiotech.com
              </a>
            </div>

            <div className="contact-info-group">
              <h4>Sales:</h4>
              <a href="mailto:sales@curiotech.com" className="contact-link">
                sales@curiotech.com
              </a>
            </div>

            <div className="contact-info-group">
              <h4>{t("contact.support")}:</h4>
              <a href="mailto:support@curiotech.com" className="contact-link">
                support@curiotech.com
              </a>
            </div>

            <div className="contact-info-group">
              <h4>Address:</h4>
              <div className="address">
                <p>CurioTech Educational Solutions</p>
                <p>123 Innovation Drive, Suite 200</p>
                <p>Tech Valley, NY 12345</p>
                <p>United States</p>
              </div>
            </div>

            {/* Office Hours Section */}
            <div className="office-hours-section">
              <h3 className="contact-info-title">Office Hours</h3>

              <div className="contact-info-group">
                <h4>{t("contact.support")}:</h4>
                <div className="office-hours">
                  <p>{t("contact.supportHours")}</p>
                  <p>Saturday: 10:00 AM - 4:00 PM EST</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>

              <div className="contact-info-group">
                <h4>{t("contact.demos")}:</h4>
                <div className="office-hours">
                  <p>{t("contact.demosAvailability")}</p>
                  <p>Evening & weekend demos available by request</p>
                </div>
              </div>

              <div className="contact-info-group">
                <h4>{t("contact.liveChat")}:</h4>
                <div className="office-hours">
                  <p>{t("contact.liveChatAvailability")}</p>
                  <p>Average response time: Under 3 minutes</p>
                </div>
              </div>
            </div>

            {/* Why Choose CurioTech Section */}
            <div className="why-choose-section">
              <h3 className="contact-info-title">
                {t("contact.whyChooseCurioTech")}
              </h3>

              <div className="feature-item">
                <span className="feature-icon">⭐</span>
                <span className="feature-text">
                  98% Customer Satisfaction Rate
                </span>
              </div>

              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span className="feature-text">
                  Average 2-hour Response Time
                </span>
              </div>

              <div className="feature-item">
                <span className="feature-icon">🏫</span>
                <span className="feature-text">
                  1000+ Successful School Implementations
                </span>
              </div>

              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <span className="feature-text">
                  24/7 Platform Uptime Guarantee
                </span>
              </div>

              <div className="feature-item">
                <span className="feature-icon">🛡️</span>
                <span className="feature-text">COPPA Compliant & Secure</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2 className="faq-title">{t("contact.faq")}</h2>

          <div className="faq-container">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${expandedFAQ === index ? "faq-active" : ""}`}
              >
                <div className="faq-question" onClick={() => toggleFAQ(index)}>
                  {faq.question}
                  <span className="faq-icon">
                    {expandedFAQ === index ? "×" : "+"}
                  </span>
                </div>
                {expandedFAQ === index && (
                  <div className="faq-answer">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
