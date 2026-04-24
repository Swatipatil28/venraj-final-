export const ClinicDTO = {
  id: "",
  name: "",
  city: "",
  state: "",
  address: "",
  phone: "",
  email: "",
  image: "",
  mapUrl: "",
};

export const createClinicDTO = (data = {}) => ({ ...ClinicDTO, ...data });
