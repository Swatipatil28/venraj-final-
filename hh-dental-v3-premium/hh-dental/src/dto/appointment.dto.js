export const AppointmentDTO = {
  patientName: "",
  phone: "",
  issue: "",
  clinicId: "",
  preferredDate: "",
  serviceId: "",
};

export const createAppointmentDTO = (data = {}) => ({ ...AppointmentDTO, ...data });

export const validateAppointmentDTO = (dto) => {
  const errors = {};
  if (!dto.patientName?.trim()) errors.patientName = "Name is required";
  if (!dto.phone?.trim()) errors.phone = "Phone number is required";
  else if (!/^\+?[\d\s\-()+]{8,15}$/.test(dto.phone.trim()))
    errors.phone = "Enter a valid phone number";
  if (!dto.issue?.trim()) errors.issue = "Please describe your concern";
  if (!dto.clinicId) errors.clinicId = "Please select a clinic";
  return { valid: Object.keys(errors).length === 0, errors };
};
