import React, { useState, useRef } from "react";
import {
  Heading,
  Box,
  Flex,
  Text,
  Image,
  Button,
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
import { EventEdit } from "./EventEdit";

export const loader = async ({ params }) => {
  try {
    const usersResponse = await fetch("http://localhost:3000/users");
    if (!usersResponse.ok) throw new Error("Failed to fetch users");

    const eventResponse = await fetch(
      `http://localhost:3000/events/${params.eventId}`
    );
    if (!eventResponse.ok) throw new Error("Failed to fetch event");

    const categoriesResponse = await fetch("http://localhost:3000/categories");
    if (!categoriesResponse.ok) throw new Error("Failed to fetch categories");

    return {
      users: await usersResponse.json(),
      event: await eventResponse.json(),
      categories: await categoriesResponse.json(),
    };
  } catch (error) {
    console.error("Loader error:", error);
    return { error: error.message };
  }
};

export const EventPage = () => {
  const {
    users,
    event: initialEvent,
    categories: initialCategories,
  } = useLoaderData();
  const [isEditing, setIsEditing] = useState(false);
  const [event, setEvent] = useState(initialEvent);
  const [categories, setCategories] = useState(initialCategories);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const cancelRef = useRef();

  const createdByUser = users.find((user) => user.id === event.createdBy);

  // Activate edit mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Handle delete event
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

  // Close delete confirmation alert
  const onCloseDeleteAlert = () => setIsDeleteAlertOpen(false);

  return (
    <div>
      <Center minHeight="100vh">
        <Box
          width={{ base: "375px", md: "650px", lg: "1000px" }}
          p={5}
          shadow="md"
          borderWidth="1px"
          borderRadius={{ base: 0, md: "md", lg: "md" }}
          bg="white"
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Flex direction="column">
              {isEditing ? (
                <EventEdit
                  event={event}
                  categories={categories}
                  setEvent={setEvent}
                  setCategories={setCategories}
                  setIsEditing={setIsEditing}
                />
              ) : (
                <>
                  <Heading mb={2}>{event.title}</Heading>
                  <Text mb={2} fontWeight="semibold">
                    Description:
                  </Text>
                  <Text>{event.description}</Text>
                </>
              )}
            </Flex>
            {!isEditing && createdByUser && (
              <Flex align="flex-end" direction="column" alignItems={"center"}>
                <Image
                  src={createdByUser.userImage}
                  borderRadius="full"
                  boxSize="100px"
                  objectFit="cover"
                />
                <Text mt={2} fontWeight="bold" fontSize={20}>
                  {createdByUser.name}
                </Text>
              </Flex>
            )}
          </Flex>
          {!isEditing && (
            <>
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
            </>
          )}
          {!isEditing && (
            <Flex direction={"row"} mt={4}>
              <Button onClick={handleEditToggle}>
                {isEditing ? "Cancel" : "Edit"}
              </Button>
              <Button
                ml={4}
                colorScheme="red"
                onClick={() => setIsDeleteAlertOpen(true)}
              >
                Delete
              </Button>
              <Button ml={4} colorScheme="blue" onClick={() => navigate("/")}>
                Events
              </Button>
            </Flex>
          )}
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
