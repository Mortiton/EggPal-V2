import { formValidation } from "@/app/(auth)/signup/components/formValidation";

describe('formValidation', () => {
    // Helper function to create form data
    const createFormData = (password, confirmPassword) => {
        const formData = new FormData();
        formData.set('password', password);
        formData.set('confirmPassword', confirmPassword);
        return formData;
    };

    // Test case for matching passwords
    it('returns no message when passwords match and meet criteria', () => {
        const formData = createFormData('Valid1@Password', 'Valid1@Password');
        const result = formValidation(formData);
        expect(result).toBe('');
    });

    // Test case for non-matching passwords
    it('returns a message when passwords do not match', () => {
        const formData = createFormData('Valid1@Password', 'Invalid1@Password');
        const result = formValidation(formData);
        expect(result).toBe('Passwords do not match');
    });

    // Test case for passwords not meeting criteria
    it('returns a message when password does not meet criteria', () => {
        const formData = createFormData('invalid', 'invalid');
        const result = formValidation(formData);
        expect(result).toBe('Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.');
    });

    // Test case for both conditions not met
    it('returns a combined message when passwords do not match and password does not meet criteria', () => {
        const formData = createFormData('invalid', 'Invalid1@Password');
        const result = formValidation(formData);
        expect(result).toBe('Passwords do not matchPassword must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.');
    });

    // Test case for empty password fields
    it('returns a message when password fields are empty', () => {
        const formData = createFormData('', '');
        const result = formValidation(formData);
        expect(result).toBe('Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.');
    });
});
