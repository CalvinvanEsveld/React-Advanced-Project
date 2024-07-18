import React, { useState, useRef } from "react";
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
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Center,
} from "@chakra-ui/react";
import { useLoaderData, useNavigate } from "react-router-dom";

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
  const {
    users,
    event: initialEvent,
    categories: initialCategories,
  } = useLoaderData();
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
  const toast = useToast();
  const navigate = useNavigate();
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const cancelRef = useRef();

  // Find the user who created the event
  const createdByUser = users.find((user) => user.id === event.createdBy);

  // Toggles edit mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent({
      ...editedEvent,
      [name]: value,
    });
  };

  // Submit form to update the event
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (selectedCategories.length === 0) {
      setCategoryError("Choose at least one category");
      return;
    }

    // Add new category/categories if they do not exists
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

    // Update event with new categories
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

  // Add a category to the list of selected categories
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

  // Remove selected category
  const removeCategory = (id) => {
    setSelectedCategories(selectedCategories.filter((cat) => cat.id !== id));
  };

  // Deleting event
  const handleDeleteEvent = async () => {
    const response = await fetch(`http://localhost:3000/events/${event.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      toast({
        title: "Event deleted.",
        description: "The event has been deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } else {
      toast({
        title: "Error.",
        description: "There was an error deleting the event.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Close confirmation alert
  const onCloseDeleteAlert = () => setIsDeleteAlertOpen(false);

  return (
    <div>
      <Center minHeight="100vh">
        <Box
          width={{ base: "375px", md: "650px", lg: "1000px" }}
          p={5}
          shadow="md"
          borderWidth="1px"
          borderRadius="md"
          bg="white"
        >
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
                <Text mb={2} fontWeight="bold" fontSize={20}>
                  {createdByUser.name}
                </Text>
                <Image
                  src={createdByUser.image}
                  alt={createdByUser.name}
                  borderRadius="full"
                  boxSize="100px"
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
              value={new Date(editedEvent.endTime)
                .toISOString()
                .substring(0, 16)}
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
                    <TagCloseButton
                      onClick={() => removeCategory(category.id)}
                    />
                  </Tag>
                ))}
              </Flex>
            </div>
          ) : (
            <Flex wrap="wrap">
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
          )}
          <Flex direction={"row"} mt={4}>
            <Button onClick={handleEditToggle}>
              {isEditing ? "Cancel" : "Edit"}
            </Button>
            {isEditing && (
              <form onSubmit={handleFormSubmit}>
                <Button ml={4} colorScheme="teal" type="submit">
                  Save
                </Button>
              </form>
            )}
            <Button
              ml={4}
              colorScheme="red"
              onClick={() => setIsDeleteAlertOpen(true)}
            >
              Delete
            </Button>
          </Flex>
        </Box>
        <AlertDialog
          isOpen={isDeleteAlertOpen}
          leastDestructiveRef={cancelRef}
          onClose={onCloseDeleteAlert}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Event
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete this event?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onCloseDeleteAlert}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={handleDeleteEvent} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Center>
    </div>
  );
};
