// Mock the API module
jest.mock('../api', () => ({
  post: jest.fn(),
}));

// Extend Jest with RTL matchers
require('@testing-library/jest-dom');

const { render, screen, act } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event').default;
const Register = require('./Register').default;
const api = require('../api'); 

const registrationData = {
  "Full Name": "Rudraharan Nivaethan",
  "Email": "nivaethan@gmail.com",
  "Registration No": "FC115565",
  "Contact Number": "0707145102",
  "Faculty": "Computing",
  "Department": "SE",
  "Password": "User@789rtl123",
  "Confirm Password": "User@789rtl123" 
};

const invalidContactNums = [
  '1234567890',
  '0812345678',
  '071234567',
  '07123456789',
  '+94123456789',
  '+9471234567',
  '07123abcd8',
  '07 123 45678',
  '+94-712345678'
];

const inputs = [
    "Full Name",
    "Email",
    "Registration No",
    "Contact Number",
    "Faculty",
    "Department",
    "Password",
    "Confirm Password",
];

const backendResponses = {
  success:   { data: { message: 'Succsfully Registered' } },
  missingName: { response: { data: { message: 'Missing Name' } } },
  invalidEmail: { response: { data: { message: 'Invalid Email' } } },
  weakPassword: { response: { data: { message: 'Please create Strong password' } } },
  existingUser: { response: { data: { message: 'User already exists' } } },
};

const fillForm = async (data, skipFields = []) => {
  for (const [name, value] of Object.entries(data)) {
    if (!skipFields.includes(name)) {
      const input = screen.getByPlaceholderText(new RegExp(`^${name}$`, "i"));
      await userEvent.type(input, value);
    }
  }
};

describe('Register Component', () => {
    describe('Rendering', () => {
        it('renders all inputs and register button', () => {
            render(<Register />); // Render Register component

            // Looping to check whether the required typing fields are rendered
            Object.keys(registrationData).forEach(name => {
                expect(screen.getByPlaceholderText(new RegExp(`^${name}$`, "i"))).toBeInTheDocument();
            });

            // Button should be rendered
            expect(screen.getByRole("button", {name: /Register/i})).toBeInTheDocument();
        });
    });

    describe('Typing', () => {
        it('should update all fields when typing', async() => {
            render(<Register />);
            await fillForm(registrationData); // Types into form

            // Check each input has the correct value
            Object.entries(registrationData).forEach(([placeholder,value]) => {
                const input = screen.getByPlaceholderText(new RegExp(`^${placeholder}$`,"i"));
                expect(input).toHaveValue(value);
            });
        });
    });

    describe('Validation', () => {
        // Test each required field individually
        Object.keys(registrationData).forEach((field) => {
            it(`prevents submission if ${field} is missing`, async () => {
                render(<Register />);
                await fillForm(registrationData, [field]);

                const button = screen.getByRole("button", { name: /Register/i });
                await act(async() => {
                    await userEvent.click(button);
                });

                const input = screen.getByPlaceholderText(new RegExp(`^${field}$`, "i"));
                expect(input.checkValidity()).toBe(false);
                expect(input.validationMessage).not.toBe("");
            });
        });

        it('prevents submission for invalid email format', async() => {
            render(<Register />);
            const emailInput = screen.getByPlaceholderText(/Email/i);
            await userEvent.type(emailInput, "invalid-email");
            // Fill other fields so only email fails
            await fillForm(registrationData, ["Email"]);

            const button = screen.getByRole("button", { name: /Register/i });
            await act(async() => {
                await userEvent.click(button);
            });

            expect(emailInput.checkValidity()).toBe(false);
            expect(emailInput.validationMessage).not.toBe("");
        });

        it('should show validation message when password and confirm password do not match', async() => {
            render(<Register />);
            const data = { ...registrationData, "Confirm Password": "Different123!" };
            await fillForm(data);
            const button = screen.getByRole("button", { name: /Register/i });
            await act(async() => {
                await userEvent.click(button);
            });
            expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
        });

        it('should prevent submission for invalid contact number', async() => {
            render(<Register />);
            for(const number of invalidContactNums){
                await fillForm({ ...registrationData, "Contact Number": number });
                const button = screen.getByRole("button", { name: /Register/i });
                await act(async() => {
                   await userEvent.click(button);
                });
                expect(screen.getByText(/Invalid contact number/i)).toBeInTheDocument();
            };
        });
    });

    describe('Form Submission', () => {
        it('shows success message on API success', async() => {
            api.post = jest.fn().mockResolvedValue({ data: { message: "Registered successfully" } });

            render(<Register />);
            await fillForm(registrationData);
            await userEvent.click(screen.getByRole("button", { name: /Register/i }));

            // Check if the success message appears
            const message = await screen.findByText(/Registered successfully/i);
            expect(message).toBeInTheDocument();
        });

        it('shows error message on API failure', async() => {
            api.post.mockRejectedValue({ response: { data: { message: "Email already exists" } } });
            render(<Register />);
            await fillForm(registrationData);
            await userEvent.click(screen.getByRole("button", {name: /Register/i}));
            const message = await screen.findByText(/Email already exists/i);
            expect(message).toBeInTheDocument();
        });
    });
});