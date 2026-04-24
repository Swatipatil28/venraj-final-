export const ServiceDTO = {
  id: "",
  title: "",
  category: "", // "dental" | "aesthetic"
  description: "",
  benefits: [],
  process: [],
  image: "",
  icon: "",
};

export const createServiceDTO = (data = {}) => ({ ...ServiceDTO, ...data });
