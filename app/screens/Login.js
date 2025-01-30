import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    Pressable,
    KeyboardAvoidingView,
    Image,
  } from "react-native";
  import React, { useState } from "react";
  import { FirebaseAuth } from "../../FirebaseConfig";
  import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
  
  const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = FirebaseAuth;
  
    const signIn = async () => {
      setLoading(true);
      try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        console.log(res);
      } catch (error) {
        console.log(error);
        alert("Failed to login. Please check your credentials and try again." + error.message);
      }
      setLoading(false);
    };
  
    const signUp = async () => {
      setLoading(true);
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        console.log(res);
        alert("Sign up successful. Please check your emails!");
      } catch (error) {
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        alert("Failed to sign up: " + error.message);
      }
      setLoading(false);
    };
  
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding">
          {/* <Image source={require("../../assets/logo.png")} style={styles.logo} /> */}
  
          <Text style={styles.welcomeText}>Welcome to ToDoIst</Text>
  
          <TextInput
            value={email}
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            value={password}
            style={styles.input}
            placeholder="Password"
            autoCapitalize="none"
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
          />
  
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              <Pressable style={styles.button} onPress={() => signIn()}>
                <Text style={styles.text}>Login</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={() => signUp()}>
                <Text style={styles.text}>Create account</Text>
              </Pressable>
            </>
          )}
        </KeyboardAvoidingView>
      </View>
    );
  };
  
  export default Login;
  
  const styles = StyleSheet.create({
    container: {
      marginHorizontal: 20,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: 20,
      resizeMode: "contain",
    },
    welcomeText: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      color: "#333",
      textAlign: "center",
    },
    input: {
      marginVertical: 8,
      height: 50,
      borderWidth: 1,
      borderRadius: 8,
      padding: 10,
      width: 300,
      backgroundColor: "#fff",
      borderColor: "#ccc",
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 8,
      elevation: 3,
      backgroundColor: "green",
      marginTop: 20,
      width: 300,
    },
    text: {
      fontSize: 16,
      fontWeight: "bold",
      color: "white",
    },
  });
  