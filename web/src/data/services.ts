import type { Service } from "./types";

export const services: Service[] = [
  {
    id: "corte",
    name: "Corte",
    description: "Tesoura e máquina, com acabamento na navalha.",
    price: 45,
    durationMinutes: 30,
    popular: true,
  },
  {
    id: "barba",
    name: "Barba",
    description: "Toalha quente, navalha e balm hidratante.",
    price: 35,
    durationMinutes: 30,
    popular: false,
  },
  {
    id: "corte-e-barba",
    name: "Corte e barba",
    description: "O combo completo, por um preço menor.",
    price: 70,
    durationMinutes: 60,
    popular: true,
  },
  {
    id: "pezinho",
    name: "Pezinho",
    description: "Acabamento do contorno entre um corte e outro.",
    price: 15,
    durationMinutes: 15,
    popular: false,
  },
  {
    id: "sobrancelha",
    name: "Sobrancelha",
    description: "Limpeza e alinhamento na navalha.",
    price: 15,
    durationMinutes: 15,
    popular: false,
  },
  {
    id: "pigmentacao",
    name: "Pigmentação de barba",
    description: "Preenche falhas e uniformiza a cor da barba.",
    price: 42.9,
    durationMinutes: 30,
    popular: false,
  },
];
