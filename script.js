const translations = {
  en: {
    navServices: "Services",
    navExperience: "Experience",
    navContact: "Contact",
    heroEyebrow: "Over 30 years of experience",
    heroHeadline: "Auto Repair and Auto Parts",
    callNow: "Call Now",
    findUs: "Find Location",
    quickLabel: "Auto service and auto parts",
    servicesKicker: "What we do",
    servicesTitle: "Services and Auto Parts",
    servicesIntro: "Complete service support for everyday maintenance, diagnostics, and quality parts.",
    serviceRepairTitle: "Auto repair services",
    serviceRepairText: "ავტოსერვისი",
    serviceDiagnosticsTitle: "Diagnostics",
    serviceDiagnosticsText: "დიაგნოსტიკა",
    serviceMechanicalTitle: "Mechanical repairs",
    serviceMechanicalText: "მექანიკური შეკეთება",
    serviceElectricalTitle: "Electrical repairs",
    serviceElectricalText: "ელექტრო სისტემის შეკეთება",
    serviceEngineTitle: "Engine",
    serviceEngineText: "ძრავის მომსახურება",
    serviceGearboxTitle: "Gearbox",
    serviceGearboxText: "გადაცემათა კოლოფის მომსახურება",
    serviceSuspensionTitle: "Suspension",
    serviceSuspensionText: "სავალი ნაწილის მომსახურება",
    serviceGeneralTitle: "General maintenance",
    serviceGeneralText: "ზოგადი მომსახურება",
    serviceTiresTitle: "Tire service",
    serviceTiresText: "საბურავების მომსახურება",
    servicePartsTitle: "All types of auto parts",
    servicePartsText: "ყველა სახის ავტონაწილები",
    experienceKicker: "Trust and reliability",
    experienceTitle: "More than 30 years on the road",
    experienceText: "With more than 30 years of experience, we provide reliable auto repair and quality auto parts for our customers.",
    contactKicker: "Contact",
    contactTitle: "Call us",
    phoneLabel: "Phone",
    addressLabel: "Address",
    addressText: "Khudia Borchaloeli 3, Tbilisi",
    footerText: "auto service and auto parts."
  },
  ka: {
    navServices: "სერვისები",
    navExperience: "გამოცდილება",
    navContact: "კონტაქტი",
    heroEyebrow: "30 წელზე მეტი გამოცდილება",
    heroHeadline: "ავტოსერვისი და ავტონაწილები",
    callNow: "დაგვირეკეთ",
    findUs: "მდებარეობა",
    quickLabel: "ავტოსერვისი და ავტონაწილები",
    servicesKicker: "რას გთავაზობთ",
    servicesTitle: "სერვისები და ავტონაწილები",
    servicesIntro: "სრული მომსახურება ყოველდღიური მოვლისთვის, დიაგნოსტიკისთვის და ხარისხიანი ნაწილებისთვის.",
    serviceRepairTitle: "ავტოსერვისი",
    serviceRepairText: "Auto repair services",
    serviceDiagnosticsTitle: "დიაგნოსტიკა",
    serviceDiagnosticsText: "Diagnostics",
    serviceMechanicalTitle: "მექანიკური შეკეთება",
    serviceMechanicalText: "Mechanical repairs",
    serviceElectricalTitle: "ელექტრო სისტემის შეკეთება",
    serviceElectricalText: "Electrical repairs",
    serviceEngineTitle: "ძრავის მომსახურება",
    serviceEngineText: "Engine",
    serviceGearboxTitle: "გადაცემათა კოლოფის მომსახურება",
    serviceGearboxText: "Gearbox",
    serviceSuspensionTitle: "სავალი ნაწილის მომსახურება",
    serviceSuspensionText: "Suspension",
    serviceGeneralTitle: "ზოგადი მომსახურება",
    serviceGeneralText: "General maintenance",
    serviceTiresTitle: "საბურავების მომსახურება",
    serviceTiresText: "Tire service",
    servicePartsTitle: "ყველა სახის ავტონაწილები",
    servicePartsText: "All types of auto parts",
    experienceKicker: "სანდოობა",
    experienceTitle: "30 წელზე მეტი გამოცდილება",
    experienceText: "30 წელზე მეტი გამოცდილებით, ჩვენ ვთავაზობთ მომხმარებლებს სანდო ავტოსერვისს და ხარისხიან ავტონაწილებს.",
    contactKicker: "კონტაქტი",
    contactTitle: "დაგვიკავშირდით",
    phoneLabel: "ტელეფონი",
    addressLabel: "მისამართი",
    addressText: "ხუდია ბორჩალოელის 3, თბილისი",
    footerText: "ავტოსერვისი და ავტონაწილები."
  }
};

const translatableNodes = document.querySelectorAll("[data-i18n]");
const languageButtons = document.querySelectorAll(".lang-btn");
const yearNode = document.querySelector("#year");

function setLanguage(language) {
  const dictionary = translations[language] || translations.en;

  translatableNodes.forEach((node) => {
    const key = node.dataset.i18n;
    if (dictionary[key]) {
      node.textContent = dictionary[key];
    }
  });

  document.documentElement.lang = language;

  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  localStorage.setItem("supermotors-language", language);
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

yearNode.textContent = new Date().getFullYear();
setLanguage(localStorage.getItem("supermotors-language") || "en");
