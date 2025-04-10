import React, { useState, useEffect } from 'react';
import { Container, Button, Card, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  console.log('App component rendered'); // Log on render

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const API_URL = 'http://172.245.56.116:65000';

  useEffect(() => {
    console.log('useEffect triggered for auth check');
    const checkAuth = async () => {
      const token = Cookies.get('access_token');
      console.log('Token from cookies:', token);
      if (token) {
        try {
          console.log('Sending auth check request to:', `${API_URL}/auth/check`);
          const response = await axios.get(`${API_URL}/auth/check`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('Auth check response:', response.data);
          setIsLoggedIn(response.data.isAuthenticated);
        } catch (error) {
          console.error('Auth check failed:', error.message, error.response?.data);
          setIsLoggedIn(false);
          Cookies.remove('access_token');
        }
      } else {
        console.log('No token found, user not logged in');
      }
    };
    checkAuth();
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted with:', { username, password });
    try {
      console.log('Sending login request to:', `${API_URL}/auth/login`);
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });
      console.log('Login response:', response.data);
      const { access_token } = response.data;
      Cookies.set('access_token', access_token, { expires: 7 });
      setIsLoggedIn(true);
      setShowLogin(false);
      setError('');
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Login error:', error.message, error.response?.data);
      setError(error.response?.data?.message || error.message || 'Login failed');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    console.log('Register form submitted with:', { username, email, password, nickname });
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    try {
      console.log('Sending register request to:', `${API_URL}/auth/register`);
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
        nickname: nickname || undefined,
      });
      console.log('Register response:', response.data);
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
      console.error('Register error:', error.message, error.response?.data);
      setError(error.response?.data?.message || error.message || 'Registration failed');
    }
  };

  const handleLogout = () => {
    console.log('Logging out');
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