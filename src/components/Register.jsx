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
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  // const [email, setEmail] = useState('');
  // const [name, setName] = useState('');
  // const [password, setPassword] = useState('');
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext);

  const handleRegister = e => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(async(res) => {
        const user = res.user;
        await updateProfile(user, { displayName: values.name });
        dispatch({ type: 'LOGIN', payload: user });
        navigate('/');
      })
      .catch(error => {
        setError(true);
      });
  };

  return (
    <Container h={'95vh'}>
      <VStack h={'full'} justifyContent="center" spacing={'8'}>
        <Heading children={'Registration'} />

        <form style={{ width: '100%' }} onSubmit={handleRegister}>
          <Box my={'4'}>
            <FormLabel htmlFor="name" children="Name" />
            <Input
              required
              id="name"
              value={values.name}
              onChange={e =>
                setValues(prev => ({ ...prev, name: e.target.value }))
              }
              placeholder="John Doe"
              type={'text'}
              focusBorderColor="yellow.500"
            />
          </Box>

          <Box my={'4'}>
            <FormLabel htmlFor="email" children="Email Address" />
            <Input
              required
              id="email"
              value={values.email}
              onChange={e =>
                setValues(prev => ({ ...prev, email: e.target.value }))
              }
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
              value={values.password}
              onChange={e =>
                setValues(prev => ({ ...prev, password: e.target.value }))
              }
              placeholder="Password here"
              type={'password'}
              focusBorderColor="yellow.500"
            />
          </Box>

          <Button my="4" colorScheme={'yellow'} type="submit">
            Sign Up
          </Button>
          {/* <Box my={'4'} color="red">
            {error && <span>Please try again in some time</span>}
          </Box> */}
          <Box my="4">
            Already Signed Up?{' '}
            <Link to="/login">
              <Button colorScheme={'yellow'} variant="link">
                Login
              </Button>{' '}
              here
            </Link>
          </Box>
        </form>
      </VStack>
    </Container>
  );
};

export default Register;
