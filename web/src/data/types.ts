export type Service = {
  id: string;
  name: string;
  description: string;
  /** Em reais. Formate com Intl.NumberFormat na hora de mostrar. */
  price: number;
  durationMinutes: number;
  popular: boolean;
};

export type Barber = {
  id: string;
  name: string;
  /** Caminho servido pela pasta public/. */
  photoUrl: string;
  specialties: string[];
};

export type Testimonial = {
  id: string;
  author: string;
  quote: string;
};

export type OpeningHours = {
  day: string;
  hours: string;
};

export type Business = {
  name: string;
  address: { street: string; district: string; city: string; state: string };
  phone: { display: string; href: string };
  whatsappUrl: string;
  openingHours: OpeningHours[];
};
