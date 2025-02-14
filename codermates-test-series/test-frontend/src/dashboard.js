import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const navItems = [
    {
      category: 'User Management',
      links: [
        { to: `/add-user`, label: 'Add User' },
        { to: `/edit-user`, label: 'Edit User' },
      ],
    },
    {
      category: 'Bulk Operations',
      links: [
        { to: `/bulk-password-upload`, label: 'Bulk Password Upload' },
        { to: `/user-bulk-upload`, label: 'User Bulk Upload' },
        { to: `/user-bulk-update`, label: 'User Bulk Update' },
      ],
    },
    {
      category: 'Batch Management',
      links: [
        { to: `/batches`, label: 'View Batch List' },
        { to: `/batches/add-batch`, label: 'Create New Batch' },
      ],
    },
    {
      category: 'Create Question Paper',
      links: [
        {to: `/question-paper`, label: 'Create Question paper'},
        {to: `/auto-generate`, label: 'Auto Generate paper'},
        {to: `/partial-question-generate`, label: 'Partial Generate paper'}
      ]
    },
    {
      category: 'Students Page',
      links: [
        {to: `/student-dashboard`, label: 'Student Dashboard'}
      ]
    },
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f7fafc',
      fontFamily: 'Arial, sans-serif',
    },
    navbar: {
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      padding: '1rem 2rem',
    },
    navbarTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#2d3748',
    },
    main: {
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '1rem',
    },
    heading: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#2d3748',
      marginBottom: '1.5rem',
    },
    cardContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem',
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      padding: '1rem',
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '1rem',
    },
    link: {
      display: 'block',
      color: '#3182ce',
      textDecoration: 'none',
      fontSize: '1rem',
      margin: '0.5rem 0',
      transition: 'color 0.2s ease-in-out',
    },
    linkHover: {
      color: '#2c5282',
      textDecoration: 'underline',
    },
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <span style={styles.navbarTitle}>Dashboard</span>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        <h1 style={styles.heading}>Welcome to the Dashboard</h1>

        <div style={styles.cardContainer}>
          {navItems.map((category, index) => (
            <div key={index} style={styles.card}>
              <h2 style={styles.cardTitle}>{category.category}</h2>
              <ul>
                {category.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.to}
                      style={styles.link}
                      onMouseOver={(e) => (e.target.style.color = styles.linkHover.color)}
                      onMouseOut={(e) => (e.target.style.color = styles.link.color)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;