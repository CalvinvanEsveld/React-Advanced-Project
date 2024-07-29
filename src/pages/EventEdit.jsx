import React, { useState } from "react";
import {
  Flex,
  Text,
  Input,
  Textarea,
  Button,
  Tag,
  TagLabel,
  TagCloseButton,
  Box,
  Center,
} from "@chakra-ui/react";

export const EventEdit = ({
  event,
  categories,
  setEvent,
  setCategories,
  setIsEditing,
}) => {
  const [editedEvent, setEditedEvent] = useState({ ...event });
  const [selectedCategories, setSelectedCategories] = useState(
    event.categoryIds.map((id) => categories.find((cat) => cat.id === id))
  );
  const [categoryName, setCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent({
      ...editedEvent,
      [name]: value,
    });
  };

  //Handle form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (selectedCategories.length === 0) {
      setCategoryError("Choose at least one category");
      return;
    }

    try {
      // Add new categories if they don't exist
      const newCategories = await Promise.all(
        selectedCategories.map(async (category) => {
          if (!category.id) {
            const response = await fetch("http://localhost:3000/categories", {
              method: "POST",
              body: JSON.stringify({ name: category.name }),
              headers: { "Content-Type": "application/json;charset=utf-8" },
            });
            if (!response.ok) {
              throw new Error("Failed to create category");
            }
            const newCategory = await response.json();
            setCategories((prev) => [...prev, newCategory]);
            return newCategory;
          }
          return category;
        })
      );

      // Update event with new category ids
      const updatedEvent = {
        ...editedEvent,
        categoryIds: newCategories.map((cat) => cat.id),
      };

      //Send updated event to server
      const response = await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      const result = await response.json();
      setEvent(result);
      setIsEditing(false);
    } catch (error) {
      setFormError(error.message);
    }
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
      setSelectedCategories((prev) => [
        ...prev,
        existingCategory || { name: categoryName },
      ]);
    }

    setCategoryName("");
  };

  const removeCategory = (id) => {
    setSelectedCategories(selectedCategories.filter((cat) => cat.id !== id));
  };

  return (
    <Center>
      <form onSubmit={handleFormSubmit}>
        <Text mb={2} fontWeight="semibold">
          Title:
        </Text>
        <Input
          required
          mb={2}
          value={editedEvent.title}
          name="title"
          onChange={handleInputChange}
        />
        <Text mb={2} fontWeight="semibold">
          Description:
        </Text>
        <Textarea
          required
          mb={2}
          value={editedEvent.description}
          name="description"
          onChange={handleInputChange}
        />
        <Text mb={2} fontWeight="semibold">
          Event Image:
        </Text>
        <Input
          required
          mb={4}
          value={editedEvent.image}
          name="image"
          onChange={handleInputChange}
        />
        <Text mb={2} fontWeight="semibold">
          Start Time:
        </Text>
        <Input
          required
          mb={4}
          value={new Date(editedEvent.startTime).toISOString().substring(0, 16)}
          name="startTime"
          type="datetime-local"
          onChange={handleInputChange}
        />
        <Text mb={2} fontWeight="semibold">
          End Time:
        </Text>
        <Input
          required
          mb={4}
          value={new Date(editedEvent.endTime).toISOString().substring(0, 16)}
          name="endTime"
          type="datetime-local"
          onChange={handleInputChange}
        />
        <Text mb={2} fontWeight="semibold">
          Categories:
        </Text>
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
        <Flex mt={4}>
          <Button colorScheme="teal" type="submit">
            Save
          </Button>
          <Button ml={2} onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </Flex>
      </form>
    </Center>
  );
};
