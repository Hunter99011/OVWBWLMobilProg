import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { FirebaseAuth, FirestoreDB } from "../../FirebaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProgressBar } from "react-native-paper";

const List = ({ navigation }) => {
  const [todos, setTodos] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cardColor, setCardColor] = useState("#ffffff");
  const [progress, setProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchTodos = async () => {
    try {
      const querySnapshot = await getDocs(collection(FirestoreDB, "todos"));
      const todoList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodos(todoList);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const loadSettings = async () => {
    try {
      const theme = await AsyncStorage.getItem("theme");
      const color = await AsyncStorage.getItem("cardColor");
      if (theme) setIsDarkMode(theme === "dark");
      if (color) setCardColor(color);
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTodos();
      loadSettings();
    }, [])
  );

  useEffect(() => {
    if (todos.length > 0) {
      const completedTasks = todos.filter((todo) => todo.completed).length;
      setProgress(completedTasks / todos.length);
    }
  }, [todos]);

  const handleComplete = async (id) => {
    try {
      const todoRef = doc(FirestoreDB, "todos", id);
      await updateDoc(todoRef, { completed: true });
      fetchTodos();
    } catch (error) {
      console.error("Error marking todo as completed:", error);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert("Delete To-Do", "Are you sure you want to delete this?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await deleteDoc(doc(FirestoreDB, "todos", id));
            fetchTodos();
          } catch (error) {
            console.error("Error deleting todo:", error);
          }
        },
        style: "destructive",
      },
    ]);
  };

  const handleEdit = (todo) => {
    navigation.navigate("AddToDo", { todo });
  };

  const sortedTodos = [...todos]
    .filter((todo) => !todo.completed)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const filteredTodos =
    selectedCategory === "All"
      ? sortedTodos
      : sortedTodos.filter((todo) => todo.category === selectedCategory);

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <Pressable
          onPress={() => FirebaseAuth.signOut()}
          style={styles.headerButton}
        >
          <Ionicons
            name="log-out-outline"
            size={24}
            color={isDarkMode ? "white" : "black"}
          />
        </Pressable>
        <Text style={[styles.headerTitle, isDarkMode && styles.textDark]}>
          To-Do List
        </Text>
        <Pressable
          onPress={() => navigation.navigate("Settings")}
          style={styles.headerButton}
        >
          <Ionicons
            name="settings-outline"
            size={24}
            color={isDarkMode ? "white" : "black"}
          />
        </Pressable>
      </View>

      <View style={styles.categoryContainer}>
        {["All", "Work", "Personal", "University"].map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Task Progress</Text>
        <ProgressBar
          progress={progress}
          color="blue"
          style={{ height: 10, borderRadius: 5 }}
        />
      </View>

      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[styles.card, { backgroundColor: item.color || "white" }]}
          >
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>
                {item.category || "Uncategorized"}
              </Text>
            </View>
            <Text style={[styles.todoTitle, isDarkMode && styles.textDark]}>
              {item.name}
            </Text>
            <Text style={[styles.todoDate, isDarkMode && styles.textDark]}>
              {item.date}
            </Text>
            <Text
              style={[styles.todoDescription, isDarkMode && styles.textDark]}
            >
              {item.description}
            </Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() => handleEdit(item)}
                style={styles.editButton}
              >
                <Ionicons name="create-outline" size={24} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleComplete(item.id)}
                style={styles.completeButton}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={24}
                  color="green"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddToDo")}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.completedTasksButton}
        onPress={() => navigation.navigate("CompletedTasks")}
      >
        <Ionicons name="checkmark-done-outline" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default List;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "white",
    elevation: 4,
  },
  headerDark: {
    backgroundColor: "#1e1e1e",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  textDark: {
    color: "white",
  },
  headerButton: {
    padding: 8,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  categoryButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#ddd",
  },
  selectedCategory: {
    backgroundColor: "blue",
  },
  categoryText: {
    fontSize: 14,
    color: "white",
  },
  progressContainer: {
    padding: 10,
    marginHorizontal: 20,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 8,
    elevation: 3,
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  todoDate: {
    fontSize: 14,
    color: "gray",
    marginVertical: 5,
  },
  todoDescription: {
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  editButton: {
    marginRight: 10,
  },
  completeButton: {
    marginRight: 10,
  },
  deleteButton: {
    marginLeft: 10,
  },
  fab: {
    position: "absolute",
    bottom: 30, // Ensure it's not too close to the edge
    right: 20,
    backgroundColor: "green",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10, // Add elevation for visibility
    zIndex: 100, // Ensure it's above other elements
  },

  completedTasksButton: {
    position: "absolute",
    bottom: 30, // Adjust position to avoid overlap
    left: 20,
    backgroundColor: "blue",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    zIndex: 100,
  },
  categoryBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#007bff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
});
