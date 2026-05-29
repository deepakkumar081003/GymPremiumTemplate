export type MembershipPlan = {
  name: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

export type Trainer = {
  name: string;
  specialty: string;
  experience: string;
  certification: string;
};

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  result: string;
};

export type GymLocation = {
  /** Replace with your gym coordinates for the map pin */
  latitude: number;
  longitude: number;
  zoom?: number;
  /** Short label shown under the map */
  mapLabel: string;
};

export type GymBrandingConfig = {
  gymName: string;
  tagline: string;
  description: string;
  whatsappNumber: string;
  contactEmail: string;
  phone: string;
  address: string;
  location: GymLocation;
  businessHours: string[];
  socialLinks: {
    instagram: string;
    facebook: string;
    youtube: string;
  };
  plans: MembershipPlan[];
  trainers: Trainer[];
  testimonials: Testimonial[];
};

export const gymConfig: GymBrandingConfig = {
  gymName: "THULI GYM",
  tagline: "Train Strong. Live Elite.",
  description:
    "THULI GYM is a premium fitness environment built for serious results, expert coaching, and a high-performance community.",
  whatsappNumber: "+919999999999",
  contactEmail: "hello@thuligym.com",
  phone: "+91 99999 99999",
  address: "24 Fit Avenue, Chennai, Tamil Nadu, India",
  location: {
    latitude: 13.0827,
    longitude: 80.2707,
    zoom: 14,
    mapLabel: "Chennai, Tamil Nadu",
  },
  businessHours: [
    "Mon - Fri: 5:30 AM to 10:30 PM",
    "Sat: 6:00 AM to 9:00 PM",
    "Sun: 7:00 AM to 1:00 PM",
  ],
  socialLinks: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
  },
  plans: [
    {
      name: "Monthly",
      price: "₹2,499",
      duration: "30 Days",
      description: "Perfect for getting started with premium training facilities.",
      features: ["Gym floor access", "1 fitness consultation", "Locker access"],
    },
    {
      name: "Quarterly",
      price: "₹6,499",
      duration: "90 Days",
      description: "Best value for consistency and measurable progress.",
      features: [
        "Everything in Monthly",
        "Diet guidance",
        "Priority support",
      ],
      highlighted: true,
    },
    {
      name: "Yearly",
      price: "₹21,999",
      duration: "365 Days",
      description: "For long-term transformation with maximum savings.",
      features: [
        "Everything in Quarterly",
        "2 body assessments",
        "Member-only events",
      ],
    },
    {
      name: "Personal Training Elite",
      price: "₹9,999",
      duration: "Monthly",
      description: "Dedicated 1:1 coaching for accelerated results.",
      features: ["Dedicated trainer", "Custom workouts", "Weekly review"],
    },
  ],
  trainers: [
    {
      name: "Arjun K",
      specialty: "Strength & Conditioning",
      experience: "8+ years",
      certification: "ACE Certified",
    },
    {
      name: "Meera S",
      specialty: "Fat Loss & Mobility",
      experience: "6+ years",
      certification: "NASM Certified",
    },
    {
      name: "Rahul V",
      specialty: "Body Recomposition",
      experience: "7+ years",
      certification: "K11 Certified",
    },
  ],
  testimonials: [
    {
      name: "Priya N",
      role: "Software Engineer",
      quote:
        "The coaching quality and atmosphere are on another level. I stayed consistent for the first time.",
      result: "Lost 11kg in 5 months",
    },
    {
      name: "Rakesh M",
      role: "Business Owner",
      quote:
        "Premium equipment, disciplined environment, and real support from trainers.",
      result: "Gained 5kg lean muscle",
    },
    {
      name: "Aishwarya T",
      role: "Doctor",
      quote:
        "I joined for fitness, but the confidence and energy improvements changed my lifestyle.",
      result: "Reduced body fat by 9%",
    },
  ],
};
