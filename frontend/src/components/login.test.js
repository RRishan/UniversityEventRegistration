// Mock the API module
jest.mock('../api', () => ({
  post: jest.fn(),
}));

// Extend Jest with RTL matchers
require('@testing-library/jest-dom');

const { render, screen, act } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event').default;
const Login = require('./Login').default;
const api = require('../api');

// Test Data
const loginData = {
  Email: 'test@example.com',
  Password: 'Secret123#',
};

const backendResponses = {
  success:      { data: { message: 'Welcome back!' } },
  invalidCreds: { response: { data: { message: 'Invalid credentials' } } },
  serverError:  new Error('Network down'),
};

// Fill the form, optionally skipping fields
const fillForm = async (data, skip = []) => {
  for (const [name, value] of Object.entries(data)) {
    if (!skip.includes(name)) {
      const input = screen.getByPlaceholderText(new RegExp(name, 'i'));
      await userEvent.type(input, value);
    }
  }
};

// Test Suite
describe('Login Component', () => {
  describe('Rendering', () => {
    it('renders all inputs and login button', () => {
      render(<Login />);
      Object.keys(loginData).forEach(name => {
        expect(screen.getByPlaceholderText(new RegExp(name, 'i'))).toBeInTheDocument();
      });
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });
  });

  describe('Typing', () => {
    it('updates fields when typing', async () => {
      render(<Login />);
      await fillForm(loginData);
      Object.entries(loginData).forEach(([ph, val]) => {
        expect(screen.getByPlaceholderText(new RegExp(ph, 'i'))).toHaveValue(val);
      });
    });
  });

  describe('Validation', () => {
    // Check required fields one by one
    Object.keys(loginData).forEach(field => {
      it(`prevents submission if ${field} is missing`, async () => {
        render(<Login />);
        await fillForm(loginData, [field]);

        const btn = screen.getByRole('button', { name: /login/i });
        await act(async () => { await userEvent.click(btn); });

        const input = screen.getByPlaceholderText(new RegExp(field, 'i'));
        expect(input.checkValidity()).toBe(false);
        expect(input.validationMessage).not.toBe('');
      });
    });

    it('invalid email format fails HTML5 validation', async () => {
      render(<Login />);
      await userEvent.type(screen.getByPlaceholderText(/email/i), 'bad-email');
      await userEvent.type(screen.getByPlaceholderText(/password/i), loginData.Password);
      const btn = screen.getByRole('button', { name: /login/i });
      await act(async () => { await userEvent.click(btn); });

      const emailInput = screen.getByPlaceholderText(/email/i);
      expect(emailInput.checkValidity()).toBe(false);
      expect(emailInput.validationMessage).not.toBe('');
    });
  });

  describe('Form Submission', () => {
    it('shows success message on API success', async () => {
      api.post.mockResolvedValueOnce(backendResponses.success);

      render(<Login />);
      await fillForm(loginData);
      await userEvent.click(screen.getByRole('button', { name: /login/i }));

      expect(await screen.findByText(/welcome back/i)).toBeInTheDocument();
    });

    it('shows backend error messages', async () => {
      api.post.mockRejectedValueOnce(backendResponses.invalidCreds);

      render(<Login />);
      await fillForm(loginData);
      await userEvent.click(screen.getByRole('button', { name: /login/i }));

      expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
    });

    it('falls back to generic message on network error', async () => {
      api.post.mockRejectedValueOnce(backendResponses.serverError);

      render(<Login />);
      await fillForm(loginData);
      await userEvent.click(screen.getByRole('button', { name: /login/i }));

      expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});
