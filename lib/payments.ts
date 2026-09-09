export const paymentProvider = {
  name: "Teya",
  methods: ["Visa", "Mastercard", "Apple Pay", "Google Pay"] as const,
};

export function paymentMethodsLabel() {
  const methods = paymentProvider.methods;
  return `${methods.slice(0, -1).join(", ")} og ${methods[methods.length - 1]}`;
}
