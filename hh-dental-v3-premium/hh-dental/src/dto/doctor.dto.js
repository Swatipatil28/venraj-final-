export const DoctorDTO = {
  id: "",
  name: "",
  specialization: "",
  experience: "",
  clinics: [],
  qualifications: "",
  bio: "",
  image: "",
};

export const createDoctorDTO = (data = {}) => ({ ...DoctorDTO, ...data });
