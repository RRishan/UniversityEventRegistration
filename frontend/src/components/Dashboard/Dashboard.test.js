// Mock React and RTL
const React = require('react');
const { render, screen, within } = require('@testing-library/react');
const { UserContext } = require('../../Context/UserContext');
const Dashboard = require('./Dashboard').default;

// Mock data
const mockUser = { name: 'Test User' };
const mockEvents = [
  { id: 1, title: 'Orientation', date: '2025-09-20' },
  { id: 2, title: 'Workshop', date: '2025-09-22' },
];

describe('Dashboard Component', () => {
  
  it('renders Sidebar with correct links', () => {
    render(
      React.createElement(
        UserContext.Provider,
        { value: { user: mockUser, events: mockEvents } },
        React.createElement(Dashboard, null)
      )
    );

    // Sidebar container
    const sidebar = screen.getByRole('complementary', { hidden: true }) || 
                    screen.getByText('Dashboard').closest('aside'); // fallback

    // Check sidebar links
    const sidebarLinks = within(sidebar).getAllByRole('listitem').map(li => li.textContent);
    expect(sidebarLinks).toContain('Dashboard');
    expect(sidebarLinks).toContain('Events');
    expect(sidebarLinks).toContain('Profile');
  });

  it('renders Header with welcome message', () => {
    render(
      React.createElement(
        UserContext.Provider,
        { value: { user: mockUser, events: mockEvents } },
        React.createElement(Dashboard, null)
      )
    );

    const header = screen.getByText(/Welcome/i).closest('header');
    expect(within(header).getByText(/Welcome Test User/i)).toBeInTheDocument();
  });

  it('renders EventList with all EventCards', () => {
    render(
      React.createElement(
        UserContext.Provider,
        { value: { user: mockUser, events: mockEvents } },
        React.createElement(Dashboard, null)
      )
    );

    const eventList = screen.getByText(/Upcoming Events/i).closest('div');
    expect(within(eventList).getByText(/Upcoming Events/i)).toBeInTheDocument();

    mockEvents.forEach(event => {
      expect(within(eventList).getByText(event.title)).toBeInTheDocument();
      expect(within(eventList).getByText(`Date: ${event.date}`)).toBeInTheDocument();
    });
  });

  it('shows "No events available" when events list is empty', () => {
    render(
      React.createElement(
        UserContext.Provider,
        { value: { user: mockUser, events: [] } },
        React.createElement(Dashboard, null)
      )
    );

    const eventList = screen.getByText(/No events available/i).closest('div');
    expect(within(eventList).getByText(/No events available/i)).toBeInTheDocument();
  });
});
