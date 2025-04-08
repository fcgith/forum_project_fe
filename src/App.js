import React, { useState, useEffect } from 'react';
import { Container, Button, Card, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const API_URL = 'http://siso_forum:8080'; // Use backend container name and port

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('access_token');
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/auth/check`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsLoggedIn(response.data.isAuthenticated);
        } catch (error) {
          console.error('Auth check failed:', error);
          setIsLoggedIn(false);
          Cookies.remove('access_token');
        }
      }
    };
    checkAuth();
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { // Added /auth/ prefix
        username,
        password,
      });
      const { access_token } = response.data;
      Cookies.set('access_token', access_token, { expires: 7 });
      setIsLoggedIn(true);
      setShowLogin(false);
      setError('');
      setUsername('');
      setPassword('');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { // Added /auth/ prefix
        username,
        email,
        password,
        nickname: nickname || undefined,
      });
      const { access_token } = response.data;
      Cookies.set('access_token', access_token, { expires: 7 });
      setIsLoggedIn(true);
      setShowRegister(false);
      setError('');
      setUsername('');
      setEmail('');
      setPassword('');
      setNickname('');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleLogout = () => {
    Cookies.remove('access_token');
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div>
          <h1>Hello World</h1>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Container>
    );
  }

  if (showLogin) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Card style={{ width: '25rem' }}>
          <Card.Body>
            <Card.Title>Login</Card.Title>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleLoginSubmit}>
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="me-2">
                Login
              </Button>
              <Button variant="link" onClick={() => { setShowLogin(false); setError(''); }}>
                Back
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (showRegister) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Card style={{ width: '25rem' }}>
          <Card.Body>
            <Card.Title>Register</Card.Title>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleRegisterSubmit}>
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password (8+ characters)</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formNickname">
                <Form.Label>Nickname (optional)</Form.Label>
                <Form.Control
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="me-2">
                Register
              </Button>
              <Button variant="link" onClick={() => { setShowRegister(false); setError(''); }}>
                Back
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '25rem' }}>
        <Card.Body>
          <Card.Title>Welcome</Card.Title>
          <Card.Text>Please choose an option to continue</Card.Text>
          <div className="d-grid gap-2">
            <Button variant="primary" size="lg" onClick={() => setShowLogin(true)}>
              Login
            </Button>
            <Button variant="secondary" size="lg" onClick={() => setShowRegister(true)}>
              Register
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default App;