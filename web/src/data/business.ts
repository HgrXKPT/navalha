import type { Business } from "./types";

export const business: Business = {
  name: "Barbearia Navalha",
  address: {
    street: "Rua dos Pinheiros, 1234",
    district: "Pinheiros",
    city: "São Paulo",
    state: "SP",
  },
  phone: { display: "(11) 91234-5678", href: "tel:+5511912345678" },
  whatsappUrl: "https://wa.me/5511912345678",
  openingHours: [
    { day: "Segunda-feira", hours: "Fechado" },
    { day: "Terça-feira", hours: "09:00 às 20:00" },
    { day: "Quarta-feira", hours: "09:00 às 20:00" },
    { day: "Quinta-feira", hours: "09:00 às 20:00" },
    { day: "Sexta-feira", hours: "09:00 às 20:00" },
    { day: "Sábado", hours: "08:00 às 18:00" },
    { day: "Domingo", hours: "Fechado" },
  ],
};
