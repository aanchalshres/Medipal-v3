export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phoneNumber.replace(/\s+/g, ''));
};

export const formatPhoneNumber = (phoneNumber: string, countryCode: string = '+977'): string => {
  // Remove any non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // If the number already starts with the country code, return as is
  if (cleaned.startsWith(countryCode.replace('+', ''))) {
    return `+${cleaned}`;
  }
  
  // Otherwise, add the country code
  return `${countryCode}${cleaned}`;
};