import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Input,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import './Home.css';
import { BsGridFill, BsList } from 'react-icons/bs';
import axios from 'axios';
import { FcBookmark } from 'react-icons/fc';
import { auth } from '../firebase';
import { Firestore } from 'firebase/firestore';

const Home = () => {
  const [news, setNews] = useState([]);
  const [isGridView, setIsGridView] = useState(true);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    if (keyword === '') {
      fetchNews();
    } else {
      const debounceEffect = setTimeout(() => {
        const filteredNews = news.filter(article => {
          const title = article.title || '';
          const description = article.description || '';

          return (
            title.toLowerCase().includes(keyword.toLowerCase()) ||
            description.toLowerCase().includes(keyword.toLowerCase())
          );
        });
        setNews(filteredNews);
      }, 300);
      return () => clearTimeout(debounceEffect);
    }
  }, [keyword]);
  const toggleView = () => {
    setIsGridView(prevState => !prevState); // Toggle the view
  };
  const fetchNews = () => {
    axios
      .get(
        `https://newsapi.org/v2/top-headlines?country=in&apiKey=63a3362f23f04b30bb6cd11e9887b300`
      )
      .then(response => {
        setNews(response.data.articles);
      });
  };
  const handleFavoriteClick = async article => {
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
    <div style={{ margin: '60px auto', maxWidth: '1000px' }}>
      <Heading align={'center'} mb={'8'}>
        Latest News
      </Heading>
      <Box m={'auto'} display={'flex'} alignItems={'center'}>
        <Input
          type="text"
          placeholder="Search"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          focusBorderColor="yellow.500"
          flex="80%"
          marginRight="2"
        />
        <Button onClick={toggleView} variant={'ghost'}>
          {isGridView ? <BsGridFill /> : <BsList />}
        </Button>
      </Box>
      <div className="news" style={{ justifyContent: 'flex-start' }}>
        <Flex direction={'row'} flexWrap="wrap">
          {news.map((article, index) => (
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="lg"
              p={2}
              my={2}
              overflowWrap={'break-word'}
              width={isGridView ? 'full' : `calc(25% - 16px)`}
              marginRight={isGridView ? 0 : '16px'}
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
                  target="_self"
                  rel="noopener noreferrer"
                  mt={2}
                  size="sm"
                  colorScheme="yellow"
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
                  <FcBookmark />
                </Button>
              </Box>
            </Box>
          ))}
        </Flex>
      </div>
    </div>
  );
};

export default Home;
