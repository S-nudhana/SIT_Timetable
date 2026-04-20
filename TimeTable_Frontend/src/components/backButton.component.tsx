import { Flex, Button } from "@chakra-ui/react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
    const navigate = useNavigate();

    return (
        <Flex my={"20px"} justify={"left"} align={"center"} gap={2} >
            <Button variant={"ghost"} onClick={() => navigate(-1)} _hover={{
                backgroundColor: "transparent",
                textUnderlineOffset: "4px",
                textDecoration: "underline",
            }}>
                <IoArrowBackOutline />
                Back
            </Button>
        </Flex>
    )
}
