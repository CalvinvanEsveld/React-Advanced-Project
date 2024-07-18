import React, { useState } from "react";
import {
  Heading,
  Box,
  Flex,
  Text,
  Link as ChakraLink,
  Image,
  Stack,
  Button,
  Select,
  Input,
  Center,
} from "@chakra-ui/react";
import { useLoaderData, Link as RouterLink } from "react-router-dom";

export const loader = async () => {
  const eventsResponse = await fetch("http://localhost:3000/events");
  const events = await eventsResponse.json();
  const categoriesResponse = await fetch("http://localhost:3000/categories");
  const categories = await categoriesResponse.json();

  return { events, categories };
};

export const EventsPage = () => {
  const { events, categories } = useLoaderData();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Handle category selection
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Handle search input
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter events based on selected category
  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      selectedCategory === "all" ||
      event.categoryIds.includes(Number(selectedCategory));
    const matchesSearchTerm = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearchTerm;
  });

  return (
    <Center>
      <Box width={{ base: "375px", md: "650px", lg: "1000px" }}>
        <Heading mb={6} mt={2} textAlign="center" color="teal.500">
          Events
        </Heading>
        <Flex direction={{ base: "column", lg: "row" }} justify="space-between">
          <Button mb={4} as={RouterLink} to="/addevent/" colorScheme="teal">
            Add Event
          </Button>
          <Flex>
            <Input
              placeholder="Search by title"
              value={searchTerm}
              onChange={handleSearchChange}
              mr={4}
            />
            <Select
              width="300px"
              onChange={handleCategoryChange}
              value={selectedCategory}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Flex>
        </Flex>
        <Stack spacing={8}>
          {filteredEvents.map((event) => (
            <Box
              key={event.id}
              p={5}
              shadow="md"
              borderWidth="1px"
              borderRadius="md"
              bg="white"
            >
              <Flex justify="space-between" align="center" mb={4}>
                <ChakraLink
                  as={RouterLink}
                  to={`event/${event.id}`}
                  fontSize="2xl"
                  fontWeight="bold"
                  color="teal.500"
                >
                  {event.title}
                </ChakraLink>
              </Flex>
              <Text mb={2} fontWeight="semibold">
                Description:
              </Text>
              <Text mb={4}>{event.description}</Text>
              <Image
                src={event.image}
                alt={event.title}
                height="300px"
                width="100%"
                objectFit="cover"
                borderRadius="md"
                mb={4}
              />
              <Text mb={2} fontWeight="semibold">
                Start Time:
              </Text>
              <Text mb={4}>{new Date(event.startTime).toLocaleString()}</Text>
              <Text mb={2} fontWeight="semibold">
                End Time:
              </Text>
              <Text mb={4}>{new Date(event.endTime).toLocaleString()}</Text>
              <Text mb={2} fontWeight="semibold">
                Categories:
              </Text>
              <Flex>
                {event.categoryIds.map((categoryId) => {
                  const category = categories.find(
                    (cat) => cat.id === categoryId
                  );
                  return (
                    <Text
                      key={category.id}
                      mr={2}
                      color="gray.600"
                      border="1px"
                      borderColor="teal.500"
                      p={1}
                      borderRadius="md"
                    >
                      {category.name}
                    </Text>
                  );
                })}
              </Flex>
            </Box>
          ))}
        </Stack>
      </Box>
    </Center>
  );
};
