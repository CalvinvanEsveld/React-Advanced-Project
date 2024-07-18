import React from "react";
import { Link } from "react-router-dom";
import { Flex, Button } from "@chakra-ui/react";

export const Navigation = () => {
  return (
    <nav>
      <Flex listStyleType="none" pt={3} pb={3} bg="teal.500">
        <Button as={Link} to="/" variant="ghost" color="white" fontSize={20}>
          Events
        </Button>
      </Flex>
    </nav>
  );
};
