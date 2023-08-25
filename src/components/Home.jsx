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
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FcBookmark } from 'react-icons/fc';
import { auth } from '../firebase';
import { Firestore } from 'firebase/firestore';

const Home = () => {
  const [news, setNews] = useState([]);
  // const [isGridView, setIsGridView] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [cardsPerRow, setCardsPerRow] = useState(1);
  useEffect(() => {
    if (keyword === '') {
      fetchNews();
    }
  }, [keyword]);
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
  const handleSearch = () => {
    const filteredNews = news.filter(article => {
      const title = article.title || '';
      const description = article.description || '';

      return (
        title.toLowerCase().includes(keyword.toLowerCase()) ||
        description.toLowerCase().includes(keyword.toLowerCase())
      );
    });
    setNews(filteredNews);
  };

  return (
    <Container h={'95vh'} p={4}>
      <Heading align={'center'} mb={'8'}>
        Latest News
      </Heading>
      <Input
        type="text"
        placeholder="Search"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
      />
      <Button colorScheme="yellow" onClick={handleSearch}>
        Search
      </Button>
      <Box mt={4}>
        <Slider
          aria-label="Cards per row"
          defaultValue={1}
          min={1}
          max={3}
          step={1}
          value={cardsPerRow}
          alignSelf={'flex-end'}
          onChange={value => setCardsPerRow(value)}
        >
          <SliderTrack bg="yellow.100">
            <SliderFilledTrack bg="yellow" />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <Text mt={2} textAlign="center">
          {cardsPerRow}
        </Text>
      </Box>
      <div
        className="news"
        style={{ justifyContent: cardsPerRow === 1 ? 'center' : 'flex-start' }}
      >
        <Flex direction={cardsPerRow === 1 ? 'column' : 'row'} flexWrap="wrap">
          {news.map((article, index) => (
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="lg"
              p={2}
              my={2}
              overflowWrap={'break-word'}
              width={`calc(${100 / cardsPerRow}% - 16px)`}
              marginRight={cardsPerRow === 1 ? 0 : '16px'}
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
                  target="_self"
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
                  <FcBookmark />
                </Button>
              </Box>
            </Box>
          ))}
        </Flex>
      </div>
    </Container>
  );
};

export default Home;
