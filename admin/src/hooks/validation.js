export const useValidation = () => {
  const messages = {
    required: "This field is required.",
    email: "Please enter a valid email address.",
    password: "Password must be at least 3 characters long.",
    imageSize: "Image size must be less than 1MB.",
    invalidDate: "Please enter a valid date.",
    endDateError: "End date must be the same or later than the start date.",
    phone: "Phone number must be exactly 9 digits.",
  };

  // Validator functions
  const requiredValidation = (value) => {
    if (!value) {
      return messages.required;
    }
    return "";
  };

  const emailValidation = (value) => {
    if (!value) return messages.required;
    const emailRegex = /^[a-z0-9.-]+@[a-z.-]+\.[a-z]+$/i;
    return emailRegex.test(value) ? "" : messages.email;
  };

  const passwordValidation = (value) => {
    if (!value) return messages.required;
    return value.length >= 3 ? "" : messages.password;
  };

  const dateValidation = (date) => {
    if (!date) {
      return messages.required;
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return messages.invalidDate;
    }

    return "";
  };

  const dateRangeValidation = (startDate, endDate) => {
    if (!endDate) {
      return messages.required;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return messages.invalidDate;
    }

    if (end < start) {
      return messages.endDateError;
    }

    return "";
  };

  const phoneValidation = (value) => {
    if (!value) return messages.required;
    const phoneRegex = /^[0-9]{9}$/;
    return phoneRegex.test(value) ? "" : messages.phone;
  };

  return {
    messages,
    requiredValidation,
    emailValidation,
    passwordValidation,
    dateValidation,
    dateRangeValidation,
    phoneValidation,
  };
};
