import type { GalleryZone } from "@/components/marketing/gallery-zone-grid";
import type { FeatureIconItem } from "@/components/marketing/feature-icon-grid";
import type { JourneyStep } from "@/components/marketing/journey-timeline";
import type { VisualShowcaseItem } from "@/components/marketing/visual-showcase-grid";
import type { GymIconName } from "@/components/marketing/gym-icon";

export const stats = [
  { label: "Active Members", value: "1,200+" },
  { label: "Certified Coaches", value: "15+" },
  { label: "Transformation Stories", value: "500+" },
];

export const facilityHighlights: FeatureIconItem[] = [
  {
    icon: "dumbbell",
    title: "Strength",
    description: "Progressive overload and structured lifting programs.",
  },
  {
    icon: "bolt",
    title: "Power",
    description: "Explosive training for speed, agility, and athletic output.",
  },
  {
    icon: "heart-pulse",
    title: "Endurance",
    description: "Cardio conditioning built for stamina and recovery.",
  },
  {
    icon: "leaf",
    title: "Lifestyle",
    description: "Balanced routines that fit real schedules and habits.",
  },
];

export const whyChooseUs: FeatureIconItem[] = [
  {
    icon: "shield",
    title: "Expert-Led Coaching",
    description: "Certified trainers guide every rep with clear progress tracking.",
  },
  {
    icon: "target",
    title: "Goal-Driven Programs",
    description: "Plans tailored to fat loss, strength, or performance milestones.",
  },
  {
    icon: "users",
    title: "Supportive Community",
    description: "Train alongside motivated members who keep you accountable.",
  },
];

export type ProgramHighlight = {
  icon: GymIconName;
  title: string;
  description: string;
};

export const programHighlights: ProgramHighlight[] = [
  {
    icon: "dumbbell",
    title: "Strength Conditioning",
    description: "Measurable progress with structured cycles and coaching checkpoints.",
  },
  {
    icon: "chart",
    title: "Fat-Loss Programs",
    description: "Lifestyle-focused plans with nutrition guidance and weekly reviews.",
  },
  {
    icon: "star",
    title: "Personal Training",
    description: "One-on-one sessions for technique, confidence, and faster results.",
  },
  {
    icon: "users",
    title: "Challenge Cycles",
    description: "Community-led transformation sprints that build lasting habits.",
  },
];

export const memberJourneySteps: JourneyStep[] = [
  {
    icon: "message",
    title: "Enquire & Connect",
    description: "Reach out via WhatsApp or visit us for a quick membership walkthrough.",
  },
  {
    icon: "clipboard",
    title: "Choose Your Plan",
    description: "Pick the membership that fits your goals and complete onboarding.",
  },
  {
    icon: "refresh",
    title: "Train & Renew",
    description: "Stay consistent with coaching support and renew online anytime.",
  },
];

export const planValueIndicators: FeatureIconItem[] = [
  {
    icon: "apple",
    title: "Nutrition Guidance",
    description: "Practical meal and habit tips aligned with your training plan.",
  },
  {
    icon: "check-circle",
    title: "Progress Checks",
    description: "Regular body and performance reviews to keep you on track.",
  },
  {
    icon: "shield",
    title: "Priority Support",
    description: "Fast help from our front desk and coaching team when you need it.",
  },
  {
    icon: "bell",
    title: "Renewal Reminders",
    description: "Timely alerts so your membership never lapses unexpectedly.",
  },
];

export const planVisualShowcase: VisualShowcaseItem[] = [
  {
    image: "/images/plans/plans1.png",
    eyebrow: "Flexible Options",
    title: "Plans Built For Every Goal",
    description:
      "From starter memberships to premium coaching bundles — choose what matches your schedule and ambition.",
  },
  {
    image: "/images/plans/plans2.png",
    eyebrow: "Premium Experience",
    title: "Train In A Space That Motivates",
    description:
      "Clean floors, quality equipment, and an atmosphere designed to keep you showing up.",
  },
];

export const aboutHeroHighlights: FeatureIconItem[] = [
  {
    icon: "star",
    title: "10+ Years",
    description: "A legacy built on member trust.",
  },
  {
    icon: "dumbbell",
    title: "Premium Gear",
    description: "State-of-the-art training equipment.",
  },
  {
    icon: "target",
    title: "Real Results",
    description: "Coaching focused on outcomes.",
  },
];

export const galleryHeroImages = [
  "/images/gallery/gallery1.png",
  "/images/gallery/gallery2.png",
  "/images/gallery/gallery3.png",
  "/images/gallery/gallery4.png",
];

export const galleryZones: GalleryZone[] = [
  {
    title: "Strength Zone",
    eyebrow: "Free Weights",
    description:
      "Racks, benches, and barbells set up for progressive strength training with room to focus.",
    image: "/images/gallery/gallery5.png",
    icon: "dumbbell",
    featured: true,
  },
  {
    title: "Functional Arena",
    eyebrow: "Athletic Training",
    description: "Open floor space for mobility, circuits, and functional movement patterns.",
    image: "/images/gallery/gallery6.png",
    icon: "bolt",
  },
  {
    title: "Cardio Deck",
    eyebrow: "Conditioning",
    description: "Treadmills, rowers, and bikes for endurance work and active recovery sessions.",
    image: "/images/gallery/gallery7.png",
    icon: "heart-pulse",
  },
  {
    title: "Recovery Lounge",
    eyebrow: "Restore & Reset",
    description: "Stretching and recovery areas to wind down after intense training blocks.",
    image: "/images/gallery/gallery8.png",
    icon: "leaf",
  },
  {
    title: "Group Studio",
    eyebrow: "Community Energy",
    description: "Dedicated space for group classes, challenges, and team-based workouts.",
    image: "/images/gallery/gallery9.png",
    icon: "users",
  },
  {
    title: "Personal Training Bay",
    eyebrow: "One-On-One",
    description: "Private coaching stations for technique work and personalised programming.",
    image: "/images/gallery/gallery10.png",
    icon: "star",
  },
];

export const galleryShowcase: VisualShowcaseItem[] = [
  {
    image: "/images/gallery/gallery11.png",
    eyebrow: "Train With Purpose",
    title: "Every Zone Has A Job",
    description:
      "From heavy lifts to recovery — each area is designed so members know exactly where to go and what to do.",
  },
  {
    image: "/images/gallery/gallery12.png",
    eyebrow: "See It For Yourself",
    title: "Visit The Floor Before You Join",
    description:
      "Book a walkthrough and experience the space, equipment, and coaching culture in person.",
  },
];

export const galleryItems = galleryZones.map((zone) => zone.title);

export const galleryHighlights: FeatureIconItem[] = [
  {
    icon: "dumbbell",
    title: "Equipment Quality",
    description: "Commercial-grade machines and free weights maintained to premium standards.",
  },
  {
    icon: "star",
    title: "Lighting & Ambience",
    description: "A focused, energizing atmosphere that makes every session feel intentional.",
  },
  {
    icon: "shield",
    title: "Clean Training Zones",
    description: "Spotless floors and organized stations so you can train with confidence.",
  },
];

export const contactQuickAccess: FeatureIconItem[] = [
  {
    icon: "clipboard",
    title: "Membership Counselling",
    description: "Get help choosing the right plan for your goals, schedule, and budget.",
  },
  {
    icon: "target",
    title: "Goal Planning Session",
    description: "Sit down with a coach to map your first 90 days of training.",
  },
  {
    icon: "users",
    title: "Gym Tour & Onboarding",
    description: "Walk the floor, see the zones, and understand how to get started.",
  },
];

export const contactFormInterests = [
  "Membership Enquiry",
  "Personal Training",
  "Gym Tour",
  "General Question",
];

export type BrandStoryBlock = {
  image: string;
  eyebrow: string;
  title: string;
  description: string;
};

export const aboutHeroImage = "/images/about/about1.png";

export const brandStoryBlocks: BrandStoryBlock[] = [
  {
    image: "/images/about/about2.png",
    eyebrow: "Our Beginning",
    title: "Built On Discipline",
    description: "Founded to give local athletes a premium space with coaching that actually delivers.",
  },
  {
    image: "/images/about/about3.png",
    eyebrow: "Today",
    title: "A Community That Shows Up",
    description: "Hundreds of members training together with structure, support, and real accountability.",
  },
  {
    image: "/images/about/about4.png",
    eyebrow: "What's Next",
    title: "Always Leveling Up",
    description: "New equipment, expanded programs, and experiences designed around member feedback.",
  },
];

export const contactHeroImage = "/images/contact/contact1.png";

export const placeholderImages = {
  brand: "/images/thuli-logo-placeholder.svg",
};

/** Home page — replace files in public/images/home/ (keep same filenames) */
export const homeSlideshowImages = [
  "/images/home/homepage1.png",
  "/images/home/homepage2.png",
  "/images/home/homepage3.png",
  "/images/home/homepage4.png",
  "/images/home/homepage5.png",
];

export const homeProgramImage = "/images/home/homepage6.png";
