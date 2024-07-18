import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Stack,
  Heading,
  Input,
  Textarea,
  Button,
  Flex,
  Tag,
  TagLabel,
  TagCloseButton,
  useToast,
} from "@chakra-ui/react";

export const AddEvent = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("Tom");
  const [userImage, setUserImage] = useState(
    "https://visualpharm.com/assets/527/Person-595b40b85ba036ed117da7ec.svg"
  );
  const [title, setTitle] = useState("Soccer");
  const [description, setDescription] = useState("Let's play soccer!");
  const [image, setImage] = useState(
    "https://i.cbc.ca/1.7067252.1703213652!/fileImage/httpImage/1850455720.jpg"
  );
  const [location, setLocation] = useState("Amsterdam");
  const [startTime, setStartTime] = useState("2024-07-16T13:05");
  const [endTime, setEndTime] = useState("2024-07-23T13:05");
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryError, setCategoryError] = useState("");
  
  const toast = useToast();
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/categories");
        const categories = await response.json();
        setCategories(categories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        toast({
          title: "Error",
          description: "Failed to fetch categories.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchCategories();
  }, [toast]);


  // Create new event
  const createEvent = async (event) => {
    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        body: JSON.stringify(event),
        headers: { "Content-Type": "application/json;charset=utf-8" },
      });
      if (!response.ok) {
        throw new Error("Failed to create event");
      }
      const newEvent = await response.json();
      setEvents([...events, newEvent]);
      return true;
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create event.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  };


  // Create new user
  const createUser = async (user) => {
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json;charset=utf-8" },
      });
      if (!response.ok) {
        throw new Error("Failed to create user");
      }
      const newUser = await response.json();
      setUsers([...users, newUser]);
      return newUser;
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create user.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return null;
    }
  };

  // Submit form to create new event
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedCategories.length === 0) {
      setCategoryError("Choose at least one category");
      return;
    }

    // Add new categories if they don't exist
    const newCategories = await Promise.all(
      selectedCategories.map(async (category) => {
        const existingCategory = categories.find(
          (cat) => cat.name.toLowerCase() === category.name.toLowerCase()
        );
        if (!existingCategory) {
          const response = await fetch("http://localhost:3000/categories", {
            method: "POST",
            body: JSON.stringify({ name: category.name }),
            headers: { "Content-Type": "application/json;charset=utf-8" },
          });
          return response.json();
        }
        return existingCategory;
      })
    );

    // Create new user and event
    const newUser = await createUser({ name, userImage });
    if (!newUser) return;

    const eventCreated = await createEvent({
      createdBy: newUser.id,
      title,
      description,
      image,
      categoryIds: newCategories.map((cat) => cat.id),
      location,
      startTime,
      endTime,
    });

    if (eventCreated) {
      toast({
        title: "Success",
        description: "Event created successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset form fields
      setName("");
      setUserImage("");
      setTitle("");
      setDescription("");
      setImage("");
      setLocation("");
      setStartTime("");
      setEndTime("");
      setSelectedCategories([]);

      // Navigate to homepage after creating event
      navigate("/");
    }
  };


  // Remove category form selected categories
  const removeCategory = (id) => {
    setSelectedCategories(selectedCategories.filter((cat) => cat.id !== id));
  };

  // Add category to the selected categories
  const addCategoryToList = () => {
    if (!categoryName) {
      setCategoryError("Category name is required");
      return;
    }

    setCategoryError("");
    const existingCategory = categories.find(
      (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (
      !selectedCategories.find(
        (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
      )
    ) {
      setSelectedCategories([
        ...selectedCategories,
        existingCategory || { name: categoryName },
      ]);
    }

    setCategoryName("");
  };

  return (
    <Flex minHeight="100vh" align="center" justify="center" bg="gray.100" p={4}>
      <Box
        p={4}
        maxW="500px"
        width="100%"
        boxShadow="lg"
        borderRadius="md"
        bg="white"
      >
        <Heading as="h1" mb={4} textAlign="center">
          Add Event
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <Input
              type="text"
              required
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <Input
              type="url"
              required
              placeholder="User Image URL"
              onChange={(e) => setUserImage(e.target.value)}
              value={userImage}
            />
            <Input
              type="text"
              required
              placeholder="Event Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
            <Textarea
              required
              placeholder="Event Description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
            <Input
              type="url"
              required
              placeholder="Event Image URL"
              onChange={(e) => setImage(e.target.value)}
              value={image}
            />
            <Input
              type="text"
              required
              placeholder="Event Location"
              onChange={(e) => setLocation(e.target.value)}
              value={location}
            />
            <Input
              type="datetime-local"
              required
              onChange={(e) => setStartTime(e.target.value)}
              value={startTime}
            />
            <Input
              type="datetime-local"
              required
              onChange={(e) => setEndTime(e.target.value)}
              value={endTime}
            />
            <Flex>
              <Input
                type="text"
                placeholder="Add Category"
                onChange={(e) => setCategoryName(e.target.value)}
                value={categoryName}
              />
              <Button onClick={addCategoryToList} colorScheme="teal" ml={2}>
                Add
              </Button>
            </Flex>
            {categoryError && <Box color="red.500">{categoryError}</Box>}
            <Flex wrap="wrap">
              {selectedCategories.map((category, index) => (
                <Tag
                  key={index}
                  size="md"
                  borderRadius="full"
                  variant="solid"
                  colorScheme="teal"
                  m={1}
                >
                  <TagLabel>{category.name}</TagLabel>
                  <TagCloseButton onClick={() => removeCategory(category.id)} />
                </Tag>
              ))}
            </Flex>
            <Button type="submit" colorScheme="teal">
              Add Event
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
};
