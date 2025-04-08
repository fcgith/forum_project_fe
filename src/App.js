import React, { useState, useEffect } from 'react';
import { Container, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const API_URL = 'http://172.245.56.116:65000';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${API_URL}/auth/check`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsLoggedIn(response.data.isAuthenticated);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    window.location.href = `${API_URL}/login`;
  };

  const handleRegister = () => {
    window.location.href = `${API_URL}/register`;
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      {isLoggedIn ? (
        <h1>Hello World</h1>
      ) : (
        <Card style={{ width: '25rem' }}>
          <Card.Body>
            <Card.Title>Welcome</Card.Title>
            <Card.Text>Please choose an option to continue</Card.Text>
            <div className="d-grid gap-2">
              <Button variant="primary" size="lg" onClick={handleLogin}>
                Login
              </Button>
              <Button variant="secondary" size="lg" onClick={handleRegister}>
                Register
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default App;