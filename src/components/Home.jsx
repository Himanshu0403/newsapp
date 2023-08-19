import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FcBookmark } from 'react-icons/fc'
import { auth } from '../firebase';
import { Firestore } from 'firebase/firestore';

const Home = () => {
  const [news, setNews] = useState([]);
  const [isGridView, setIsGridView] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);
  const fetchNews = () => {
    axios
      .get(
        'https://newsapi.org/v2/top-headlines?country=in&apiKey=63a3362f23f04b30bb6cd11e9887b300'
      )
      .then(response => {
        setNews(response.data.articles);
      });
  };
  const handleFavoriteClick =async (article) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('User not logged in.');
        return;
      }
  
      const userRef = Firestore.collection('users').doc(user.uid);
  
      await userRef.collection('savedArticles').add(article);
  
      console.log('Article saved as favorite:', article);
    } catch (error) {
      console.error('Error saving article as favorite:', error);
    }
  };
  return (
    <Container h={'95vh'} p={4}>
      <Heading align={'center'} mb={'8'}>
        Latest News
      </Heading>
      
      <Flex direction="column">
        {news.length > 0 ? (
          news.map((article, index) => (
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="lg"
              p={2}
              my={2}
              display="flex"
              alignItems="center"
            >
              <Image
                src={article.urlToImage}
                alt={article.title}
                boxSize="100px"
                objectFit="cover"
                marginRight="10px"
              />
              <Box>
                <Heading as="h3" size="sm">
                  {article.title}
                </Heading>
                <Text fontSize="sm">{article.description}</Text>
                <Button
                  as="a"
                  href={article.url}
                  colorScheme="blue"
                  target="_blank"
                  rel="noopener noreferrer"
                  mt={2}
                  size="sm"
                >
                  Read More
                </Button>
                <Button
                  size="md"
                  mt={2}
                  ml={50}
                  variant={'ghost'}
                  onClick={() => handleFavoriteClick(article)}
                >
                  <FcBookmark/>
                </Button>
              </Box>
            </Box>
          ))
        ) : (
          <p>Loading news...</p>
        )}
      </Flex>
      </Container>
  );
};

export default Home;
