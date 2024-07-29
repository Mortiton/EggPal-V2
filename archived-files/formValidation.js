/**
 * Function to validate form data.
 * It checks if the password and confirmPassword fields match and if the password meets certain criteria.
 * If the fields do not match or the password does not meet the criteria, it returns a validation message.
 *
 * @param {FormData} formData - The form data to validate.
 * @returns {string} A string containing validation messages.
 */
export function formValidation(formData) {
    // Get the password and confirmPassword fields from the form data
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')
    let validationMessage = '';

    // Check if the password and confirmPassword fields match
    if (password !== confirmPassword) {
        validationMessage = 'Passwords do not match'
    }

    // Regular expression to check if the password meets certain criteria
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Check if the password meets the criteria
    if (!passwordRegex.test(password)) {
      validationMessage += 'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.';
    }

    // Return the validation message
    return validationMessage;
}

formValidation.displayName = 'formValidation'