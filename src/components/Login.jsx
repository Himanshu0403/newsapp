import {
  Box,
  Button,
  Container,
  FormLabel,
  Heading,
  Input,
  VStack,
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext);

  const handleLogin = e => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then(async (res) => {
        const user = res.user;
        dispatch({ type: "LOGIN", payload: user });
        navigate("/");
      })
      .catch(error => {
        setError(true);
      });
  };

  return (
    <Container h={'95vh'}>
      <VStack h={'full'} justifyContent={'center'} spacing={'16'}>
        <Heading children={'Login'} />
        <form style={{ width: '100%' }} onSubmit={handleLogin}>
          <Box my={'4'}>
            <FormLabel htmlFor="email" children="Email Address" />
            <Input
              required
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@example.com"
              type={'email'}
              focusBorderColor="yellow.500"
            />
          </Box>
          <Box my={'4'}>
            <FormLabel htmlFor="password" children="Password" />
            <Input
              required
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password here"
              type={'password'}
              focusBorderColor="yellow.500"
            />
          </Box>
          <Button my={'4'} colorScheme="yellow" type="submit">
            Login
          </Button>
          <Box my={'4'} color="red"> {/* Wrap the error message */}
            {error && <span >Wrong credentials</span>}
          </Box>
          <Box my={'4'}>
            New User ?
            <Link to="/register">
              <Button marginLeft={'1'} colorScheme="yellow" variant={'link'}>
                SignUp
              </Button>{' '}
              here
            </Link>
          </Box>
        </form>
      </VStack>
    </Container>
  );
};

export default Login;
