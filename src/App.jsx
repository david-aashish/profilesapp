import { useState, useEffect } from "react";
import {
  Button,
  Heading,
  Flex,
  View,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { getCurrentUser } from "aws-amplify/auth";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

export default function App() {
  const [userprofiles, setUserProfiles] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const { signOut } = useAuthenticator();

  useEffect(() => {
    fetchUserProfile();
    fetchCurrentUser();
  }, []);

  async function fetchUserProfile() {
    const { data: profiles } = await client.models.UserProfile.list();
    setUserProfiles(profiles);
  }
  
  async function fetchCurrentUser() {
    try {
      const user = await getCurrentUser();
      console.log("Current user data:", user);
      setCurrentUserEmail(user.signInDetails?.loginId || "");
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  }

  return (
    <Flex
      className="App"
      justifyContent="center"
      alignItems="center"
      direction="column"
      width="70%"
      margin="0 auto"
    >
      <Heading level={1}>My Profile</Heading>

      <Divider />

      <Grid
        margin="3rem 0"
        autoFlow="column"
        justifyContent="center"
        gap="2rem"
        alignContent="center"
      >
        {userprofiles.map((userprofile) => (
          <Flex
            key={userprofile.id || userprofile.email}
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap="2rem"
            border="1px solid #ccc"
            padding="2rem"
            borderRadius="5%"
            className="box"
          >
            <View>
              <Heading level="3">{userprofile.email}</Heading>
            </View>
          </Flex>
        ))}
      </Grid>
      {currentUserEmail && (
        <Heading level={3} padding="1rem 0">
          {currentUserEmail}
        </Heading>
      )}
      <Button onClick={signOut}>Sign Out</Button>
    </Flex>
  );
}