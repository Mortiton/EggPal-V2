export function formValidation(formData) {
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')
    let validationMessage = '';

    if (password!== confirmPassword) {
        validationMessage = 'Passwords do not match'
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      validationMessage += 'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.';
    }

    return validationMessage;
}