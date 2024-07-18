import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";

export const AddEvent = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("Calvin");
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

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("http://localhost:3000/categories");
      const categories = await response.json();
      setCategories(categories);
    };

    fetchCategories();
  }, []);

  const createEvent = async (event) => {
    const response = await fetch("http://localhost:3000/events", {
      method: "POST",
      body: JSON.stringify(event),
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    const newEvent = await response.json();
    setEvents([...events, newEvent]);
  };

  const createUser = async (user) => {
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    const newUser = await response.json();
    setUsers([...users, newUser]);
    return newUser;
  };

  const addCategory = async () => {
    if (!categoryName) {
      setCategoryError("Category name is required");
      return;
    }

    setCategoryError("");
    let category = categories.find(
      (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (!category) {
      const response = await fetch("http://localhost:3000/categories", {
        method: "POST",
        body: JSON.stringify({ name: categoryName }),
        headers: { "Content-Type": "application/json;charset=utf-8" },
      });
      category = await response.json();
      setCategories([...categories, category]);
    }

    if (!selectedCategories.find((cat) => cat.id === category.id)) {
      setSelectedCategories([...selectedCategories, category]);
    }

    setCategoryName("");
  };

  const removeCategory = (id) => {
    setSelectedCategories(selectedCategories.filter((cat) => cat.id !== id));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (selectedCategories.length === 0) {
      setCategoryError("At least one category is required");
      return;
    }

    createUser({ name, userImage }).then((newUser) => {
      createEvent({
        createdBy: newUser.id,
        title,
        description,
        image,
        categoryIds: selectedCategories.map((cat) => cat.id),
        location,
        startTime,
        endTime,
      });

      setName("");
      setUserImage("");
      setTitle("");
      setDescription("");
      setImage("");
      setLocation("");
      setStartTime("");
      setEndTime("");
      setSelectedCategories([]);
    });
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
              <Button onClick={addCategory} colorScheme="teal" ml={2}>
                Add
              </Button>
            </Flex>
            {categoryError && <Box color="red.500">{categoryError}</Box>}
            <Flex wrap="wrap">
              {selectedCategories.map((category) => (
                <Tag
                  key={category.id}
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

import React, { useState } from "react";
import { Box, Stack } from "@chakra-ui/react";

export const AddEvent = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const createEvent = async (event) => {
    const response = await fetch("http://localhost:3000/events", {
      method: "POST",
      body: JSON.stringify(event),
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    event.id = (await response.json()).id;
    setEvents(events.concat(event));
  };

  const createUser = async (user) => {
    const response = await fetch("http://localhost:3000/events", {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    user.id = (await response.json()).id;
    setUsers(users.concat(user));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    createEvent({ title, description, image, location, startTime, endTime });
    createUser({ name, userImage });

    setName("");
    setUserImage("");
    setTitle("");
    setDescription("");
    setImage("");
    setLocation("");
    setStartTime("");
    setEndTime("");
  };

  return (
    <Box>
      <Stack spacing={4} >
        <div>
          <h1>Add Event Here</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              required="required"
              placeholder="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <input
              type="url"
              required="required"
              placeholder="user image url"
              onChange={(e) => setName(e.target.value)}
              value={userImage}
            />
            <input
              type="text"
              required="required"
              placeholder="event title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
            <textarea
              type="text"
              required="required"
              placeholder="event description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
            <input
              type="url"
              required="required"
              placeholder="event image url"
              onChange={(e) => setImage(e.target.value)}
              value={image}
            />
            <input
              type="text"
              required="required"
              placeholder="event location"
              onChange={(e) => setLocation(e.target.value)}
              value={location}
            />
            <input
              type="datetime-local"
              required="required"
              placeholder="event Start time"
              onChange={(e) => setStartTime(e.target.value)}
              value={startTime}
            />
            <input
              type="datetime-local"
              required="required"
              placeholder="event End time"
              onChange={(e) => setEndTime(e.target.value)}
              value={endTime}
            />
            <input
              type="text"
              required="required"
              placeholder="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <button type="submit">Add Event</button>
          </form>
        </div>
      </Stack>
    </Box>
  );
};

import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Heading,
  Input,
  Textarea,
  Select,
  Button,
  Flex,
} from "@chakra-ui/react";

export const AddEvent = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("http://localhost:3000/categories");
      const categories = await response.json();
      setCategories(categories);
    };

    fetchCategories();
  }, []);

  const createEvent = async (event) => {
    const response = await fetch("http://localhost:3000/events", {
      method: "POST",
      body: JSON.stringify(event),
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    const newEvent = await response.json();
    setEvents([...events, newEvent]);
  };

  const createUser = async (user) => {
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    const newUser = await response.json();
    setUsers([...users, newUser]);
    return newUser;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    createUser({ name, userImage }).then((newUser) => {
      createEvent({
        createdBy: newUser.id,
        title,
        description,
        image,
        categoryIds: [Number(selectedCategory)],
        location,
        startTime,
        endTime,
      });

      setName("");
      setUserImage("");
      setTitle("");
      setDescription("");
      setImage("");
      setLocation("");
      setStartTime("");
      setEndTime("");
      setSelectedCategory("");
    });
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
            <Select
              required
              placeholder="Select category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            <Button type="submit" colorScheme="teal">
              Add Event
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
};

import React, { useState, useEffect } from "react";
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
  TagCloseButton
} from "@chakra-ui/react";

export const AddEvent = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("http://localhost:3000/categories");
      const categories = await response.json();
      setCategories(categories);
    };

    fetchCategories();
  }, []);

  const createEvent = async (event) => {
    const response = await fetch("http://localhost:3000/events", {
      method: "POST",
      body: JSON.stringify(event),
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    const newEvent = await response.json();
    setEvents([...events, newEvent]);
  };

  const createUser = async (user) => {
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    const newUser = await response.json();
    setUsers([...users, newUser]);
    return newUser;
  };

  const addCategory = async () => {
    if (!categoryName) return;

    let category = categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());

    if (!category) {
      const response = await fetch("http://localhost:3000/categories", {
        method: "POST",
        body: JSON.stringify({ name: categoryName }),
        headers: { "Content-Type": "application/json;charset=utf-8" },
      });
      category = await response.json();
      setCategories([...categories, category]);
    }

    if (!selectedCategories.find(cat => cat.id === category.id)) {
      setSelectedCategories([...selectedCategories, category]);
    }

    setCategoryName("");
  };

  const removeCategory = (id) => {
    setSelectedCategories(selectedCategories.filter(cat => cat.id !== id));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    createUser({ name, userImage }).then((newUser) => {
      createEvent({
        createdBy: newUser.id,
        title,
        description,
        image,
        categoryIds: selectedCategories.map(cat => cat.id),
        location,
        startTime,
        endTime,
      });

      setName("");
      setUserImage("");
      setTitle("");
      setDescription("");
      setImage("");
      setLocation("");
      setStartTime("");
      setEndTime("");
      setSelectedCategories([]);
    });
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
              <Button onClick={addCategory} colorScheme="teal" ml={2}>
                Add
              </Button>
            </Flex>
            <Flex wrap="wrap">
              {selectedCategories.map(category => (
                <Tag
                  key={category.id}
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



// -----------------------------------------------------------------------------------------

import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { EventPage } from "./pages/EventPage";
import { EventsPage, loader as eventsPageLoader } from "./pages/EventsPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./components/Root";
import { AddEvent} from "./pages/AddEvent";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <EventsPage />,
        loader: eventsPageLoader,
      },
      {
        path: "/event/:eventId",
        element: <EventPage />,
        // loader: postLoader,
        // action: addComment,
      },
      {
        path: "/addevent/",
        element: <AddEvent />,
        action: AddEvent.handleSubmit,
      },
    ],
  },
]);
// @ts-ignore
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);

// -----------------------------------------------------------------------------------------

import React from "react";
import { Heading } from "@chakra-ui/react";
import { useLoaderData, Link } from "react-router-dom";

export const loader = async () => {
  const eventsResponse = await fetch("http://localhost:3000/events");
  const events = await eventsResponse.json();
  const categoriesResponse = await fetch("http://localhost:3000/categories");
  const categories = await categoriesResponse.json();

  return { events, categories };
};

export const EventsPage = () => {
  const { events, categories } = useLoaderData();
  return (
    <div className="event-list">
      <Heading>List of events</Heading>
      <br />
      {events.map((event) => (
        <div key={event.id} className="event">
          <Link to={`event/${event.id}`}>{event.title}</Link>

          {"  "}
          <p>description:</p>
          {event.description}
          {"  "}
          <img src={event.image} height={300} width={200} />
          {"  "}
          <p>Start time</p>
          {event.startTime}
          {"  "}
          <p>End time:</p>
          {event.endTime}
          {"  "}
          <ul>
            <p>Categories:</p>
            {event.categoryIds.map((categoryId) => {
              const category = categories.find((cat) => cat.id === categoryId);
              return <li key={category.id}>{category.name}</li>;
            })}
          </ul>
          <br />
        </div>
      ))}
      <Link to={"/addevent/"}>Add event</Link>
    </div>
  );
};

// -----------------------------------------------------------------------------------------


import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";

export const AddEvent = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("Calvin");
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

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("http://localhost:3000/categories");
      const categories = await response.json();
      setCategories(categories);
    };

    fetchCategories();
  }, []);

  const createEvent = async (event) => {
    const response = await fetch("http://localhost:3000/events", {
      method: "POST",
      body: JSON.stringify(event),
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    const newEvent = await response.json();
    setEvents([...events, newEvent]);
  };

  const createUser = async (user) => {
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    const newUser = await response.json();
    setUsers([...users, newUser]);
    return newUser;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedCategories.length === 0) {
      setCategoryError("At least one category is required");
      return;
    }

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
      

    createUser({ name, userImage }).then((newUser) => {
      createEvent({
        createdBy: newUser.id,
        title,
        description,
        image,
        categoryIds: newCategories.map((cat) => cat.id),
        location,
        startTime,
        endTime,
      });

      setName("");
      setUserImage("");
      setTitle("");
      setDescription("");
      setImage("");
      setLocation("");
      setStartTime("");
      setEndTime("");
      setSelectedCategories([]);
    });
  };

  const removeCategory = (id) => {
    setSelectedCategories(selectedCategories.filter((cat) => cat.id !== id));
  };

  const addCategoryToList = () => {
    if (!categoryName) {
      setCategoryError("Category name is required");
      return;
    }

    setCategoryError("");
    if (!selectedCategories.find((cat) => cat.name.toLowerCase() === categoryName.toLowerCase())) {
      setSelectedCategories([...selectedCategories, { name: categoryName }]);
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


import React from "react";
import { Heading, Box, Flex, Text, Image } from "@chakra-ui/react";
import { useLoaderData, Link } from "react-router-dom";

export const loader = async ({ params }) => {
  const users = await fetch("http://localhost:3000/users");
  const event = await fetch(`http://localhost:3000/events/${params.eventId}`);
  const categories = await fetch("http://localhost:3000/categories");

  return {
    users: await users.json(),
    event: await event.json(),
    categories: await categories.json(),
  };
};



export const EventPage = () => {
  const { users, event, categories } = useLoaderData();

  const createdByUser = users.find(user => user.id === event.createdBy);
  
  return (
    <div>
      <Box
        p={5}
        shadow="md"
        borderWidth="1px"
        borderRadius="md"
        bg="white"
      >
        <Flex justify="space-between" align="center" mb={4}>
          <Heading>{event.title}</Heading>
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
            const category = categories.find((cat) => cat.id === categoryId);
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
    </div>
  );
};


// EventPage.jsx before editing button 11 july, 13:45

import React from "react";
import { Heading, Box, Flex, Text, Image } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";

export const loader = async ({ params }) => {
  const users = await fetch("http://localhost:3000/users");
  const event = await fetch(`http://localhost:3000/events/${params.eventId}`);
  const categories = await fetch("http://localhost:3000/categories");

  return {
    users: await users.json(),
    event: await event.json(),
    categories: await categories.json(),
  };
};

export const EventPage = () => {
  const { users, event, categories } = useLoaderData();

  const createdByUser = users.find((user) => user.id === event.createdBy);

  return (
    <div>
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
        <Flex justify="space-between" align="center" mb={4}>
          <Flex direction="column">
            <Heading mb={2}>{event.title}</Heading>
            <Text mb={2} fontWeight="semibold">
              Description:
            </Text>
            <Text>{event.description}</Text>
          </Flex>
          {createdByUser && (
            <Flex align="flex-end" direction="column" textAlign="right">
              <Text mb={2} fontWeight="bold">
                {createdByUser.name}
              </Text>
              <Image
                src={createdByUser.image}
                alt={createdByUser.name}
                borderRadius="full"
                boxSize="50px"
                objectFit="cover"
              />
            </Flex>
          )}
        </Flex>
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
            const category = categories.find((cat) => cat.id === categoryId);
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
    </div>
  );
};


import React, { useState } from "react";
import {
  Heading,
  Box,
  Flex,
  Text,
  Image,
  Button,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";

export const loader = async ({ params }) => {
  const users = await fetch("http://localhost:3000/users");
  const event = await fetch(`http://localhost:3000/events/${params.eventId}`);
  const categories = await fetch("http://localhost:3000/categories");

  return {
    users: await users.json(),
    event: await event.json(),
    categories: await categories.json(),
  };
};

export const EventPage = () => {
  const { users, event: initialEvent, categories } = useLoaderData();
  const [isEditing, setIsEditing] = useState(false);
  const [event, setEvent] = useState(initialEvent);
  const [editedEvent, setEditedEvent] = useState({ ...initialEvent });

  const createdByUser = users.find((user) => user.id === event.createdBy);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent({
      ...editedEvent,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:3000/events/${event.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedEvent),
    });
    const updatedEvent = await response.json();
    setEvent(updatedEvent);
    setIsEditing(false);
  };

  return (
    <div>
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
        <Flex justify="space-between" align="center" mb={4}>
          <Flex direction="column">
            {isEditing ? (
              <Input
                required
                mb={2}
                value={editedEvent.title}
                name="title"
                onChange={handleInputChange}
              />
            ) : (
              <Heading mb={2}>{event.title}</Heading>
            )}
            <Text mb={2} fontWeight="semibold">
              Description:
            </Text>
            {isEditing ? (
              <Textarea
                required
                mb={2}
                value={editedEvent.description}
                name="description"
                onChange={handleInputChange}
              />
            ) : (
              <Text>{event.description}</Text>
            )}
          </Flex>
          {createdByUser && (
            <Flex align="flex-end" direction="column" textAlign="right">
              <Text mb={2} fontWeight="bold">
                {createdByUser.name}
              </Text>
              <Image
                src={createdByUser.image}
                alt={createdByUser.name}
                borderRadius="full"
                boxSize="50px"
                objectFit="cover"
              />
            </Flex>
          )}
        </Flex>
        {isEditing ? (
          <Input
            required
            mb={4}
            value={editedEvent.image}
            name="image"
            onChange={handleInputChange}
          />
        ) : (
          <Image
            src={event.image}
            alt={event.title}
            height="300px"
            width="100%"
            objectFit="cover"
            borderRadius="md"
            mb={4}
          />
        )}
        <Text mb={2} fontWeight="semibold">
          Start Time:
        </Text>
        {isEditing ? (
          <Input
            required
            mb={4}
            value={new Date(editedEvent.startTime)
              .toISOString()
              .substring(0, 16)}
            name="startTime"
            type="datetime-local"
            onChange={handleInputChange}
          />
        ) : (
          <Text mb={4}>{new Date(event.startTime).toLocaleString()}</Text>
        )}
        <Text mb={2} fontWeight="semibold">
          End Time:
        </Text>
        {isEditing ? (
          <Input
            required
            mb={4}
            value={new Date(editedEvent.endTime).toISOString().substring(0, 16)}
            name="endTime"
            type="datetime-local"
            onChange={handleInputChange}
          />
        ) : (
          <Text mb={4}>{new Date(event.endTime).toLocaleString()}</Text>
        )}
        <Text mb={2} fontWeight="semibold">
          Categories:
        </Text>
        <Flex>
          {event.categoryIds.map((categoryId) => {
            const category = categories.find((cat) => cat.id === categoryId);
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
        <Flex direction={"row"}>
          <Button mt={4} onClick={handleEditToggle}>
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          {isEditing && (
            <form onSubmit={handleFormSubmit}>
              <Button mt={4} ml={4} colorScheme="teal">
                Save
              </Button>
            </form>
          )}
        </Flex>
      </Box>
    </div>
  );
};


import React, { useState } from "react";
import {
  Heading,
  Box,
  Flex,
  Text,
  Image,
  Button,
  Input,
  Textarea,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";

export const loader = async ({ params }) => {
  const users = await fetch("http://localhost:3000/users");
  const event = await fetch(`http://localhost:3000/events/${params.eventId}`);
  const categories = await fetch("http://localhost:3000/categories");

  return {
    users: await users.json(),
    event: await event.json(),
    categories: await categories.json(),
  };
};

export const EventPage = () => {
  const { users, event: initialEvent, categories: initialCategories } = useLoaderData();
  const [isEditing, setIsEditing] = useState(false);
  const [event, setEvent] = useState(initialEvent);
  const [editedEvent, setEditedEvent] = useState({ ...initialEvent });
  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategories, setSelectedCategories] = useState(
    initialEvent.categoryIds.map((id) =>
      initialCategories.find((cat) => cat.id === id)
    )
  );
  const [categoryName, setCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const createdByUser = users.find((user) => user.id === event.createdBy);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent({
      ...editedEvent,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (selectedCategories.length === 0) {
      setCategoryError("At least one category is required");
      return;
    }

    const newCategories = await Promise.all(
      selectedCategories.map(async (category) => {
        if (!category.id) {
          const response = await fetch("http://localhost:3000/categories", {
            method: "POST",
            body: JSON.stringify({ name: category.name }),
            headers: { "Content-Type": "application/json;charset=utf-8" },
          });
          const newCategory = await response.json();
          setCategories([...categories, newCategory]);
          return newCategory;
        }
        return category;
      })
    );

    const updatedEvent = {
      ...editedEvent,
      categoryIds: newCategories.map((cat) => cat.id),
    };

    const response = await fetch(`http://localhost:3000/events/${event.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEvent),
    });
    const result = await response.json();
    setEvent(result);
    setIsEditing(false);
  };

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

  const removeCategory = (id) => {
    setSelectedCategories(selectedCategories.filter((cat) => cat.id !== id));
  };

  return (
    <div>
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
        <Flex justify="space-between" align="center" mb={4}>
          <Flex direction="column">
            {isEditing ? (
              <Input
                required
                mb={2}
                value={editedEvent.title}
                name="title"
                onChange={handleInputChange}
              />
            ) : (
              <Heading mb={2}>{event.title}</Heading>
            )}
            <Text mb={2} fontWeight="semibold">
              Description:
            </Text>
            {isEditing ? (
              <Textarea
                required
                mb={2}
                value={editedEvent.description}
                name="description"
                onChange={handleInputChange}
              />
            ) : (
              <Text>{event.description}</Text>
            )}
          </Flex>
          {createdByUser && (
            <Flex align="flex-end" direction="column" textAlign="right">
              <Text mb={2} fontWeight="bold">
                {createdByUser.name}
              </Text>
              <Image
                src={createdByUser.image}
                alt={createdByUser.name}
                borderRadius="full"
                boxSize="50px"
                objectFit="cover"
              />
            </Flex>
          )}
        </Flex>
        {isEditing ? (
          <Input
            required
            mb={4}
            value={editedEvent.image}
            name="image"
            onChange={handleInputChange}
          />
        ) : (
          <Image
            src={event.image}
            alt={event.title}
            height="300px"
            width="100%"
            objectFit="cover"
            borderRadius="md"
            mb={4}
          />
        )}
        <Text mb={2} fontWeight="semibold">
          Start Time:
        </Text>
        {isEditing ? (
          <Input
            required
            mb={4}
            value={new Date(editedEvent.startTime)
              .toISOString()
              .substring(0, 16)}
            name="startTime"
            type="datetime-local"
            onChange={handleInputChange}
          />
        ) : (
          <Text mb={4}>{new Date(event.startTime).toLocaleString()}</Text>
        )}
        <Text mb={2} fontWeight="semibold">
          End Time:
        </Text>
        {isEditing ? (
          <Input
            required
            mb={4}
            value={new Date(editedEvent.endTime).toISOString().substring(0, 16)}
            name="endTime"
            type="datetime-local"
            onChange={handleInputChange}
          />
        ) : (
          <Text mb={4}>{new Date(event.endTime).toLocaleString()}</Text>
        )}
        <Text mb={2} fontWeight="semibold">
          Categories:
        </Text>
        {isEditing ? (
          <div>
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
            <Flex wrap="wrap" mt={2}>
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
          </div>
        ) : (
          <Flex wrap="wrap">
            {event.categoryIds.map((categoryId) => {
              const category = categories.find((cat) => cat.id === categoryId);
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
        )}
        <Flex direction={"row"}>
          <Button mt={4} onClick={handleEditToggle}>
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          {isEditing && (
            <form onSubmit={handleFormSubmit}>
              <Button mt={4} ml={4} colorScheme="teal" type="submit">
                Save
              </Button>
            </form>
          )}
        </Flex>
      </Box>
    </div>
  );
};



