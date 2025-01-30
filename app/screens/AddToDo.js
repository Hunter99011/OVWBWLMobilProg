import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, StyleSheet, Pressable, Alert, TouchableOpacity 
} from "react-native";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { FirestoreDB } from "../../FirebaseConfig";
import DateTimePicker from "@react-native-community/datetimepicker";

const categories = ["Work", "Personal", "University"];

const AddToDo = ({ navigation, route }) => {
  const existingTodo = route.params?.todo || null;

  const [name, setName] = useState(existingTodo ? existingTodo.name : "");
  const [description, setDescription] = useState(existingTodo ? existingTodo.description : "");
  const [date, setDate] = useState(existingTodo ? new Date(existingTodo.date) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [color, setColor] = useState(existingTodo ? existingTodo.color : "white");
  const [category, setCategory] = useState(existingTodo ? existingTodo.category : "Work");
  const [tags, setTags] = useState(existingTodo ? existingTodo.tags || [] : []);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (existingTodo) {
      setName(existingTodo.name);
      setDescription(existingTodo.description);
      setDate(new Date(existingTodo.date));
      setColor(existingTodo.color);
      setCategory(existingTodo.category);
      setTags(existingTodo.tags || []);
    }
  }, [existingTodo]);

  const handleSaveToDo = async () => {
    if (!name.trim() || !description.trim()) {
      Alert.alert("Error", "Please enter a name and description for the to-do.");
      return;
    }

    try {
      if (existingTodo) {
        const todoRef = doc(FirestoreDB, "todos", existingTodo.id);
        await updateDoc(todoRef, {
          name,
          description,
          date: date.toISOString().split("T")[0],
          color,
          category,
          tags,
        });
      } else {
        await addDoc(collection(FirestoreDB, "todos"), {
          name,
          description,
          date: date.toISOString().split("T")[0],
          color,
          category,
          tags,
        });
      }

      Alert.alert("Success", existingTodo ? "To-Do updated successfully!" : "To-Do added successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving to-do:", error);
      Alert.alert("Error", "Could not save to-do. Try again.");
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>To-Do Name</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter to-do name" 
        value={name} 
        onChangeText={setName} 
      />

      <Text style={styles.label}>Description</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        placeholder="Enter description" 
        value={description} 
        onChangeText={setDescription} 
        multiline 
      />

      <Text style={styles.label}>Due Date</Text>
      <Pressable style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>{date.toDateString()}</Text>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

    <Text style={styles.label}>Select To-Do Color</Text>
      <View style={styles.colorOptions}>
        {["white", "lightblue", "lightgreen", "lightcoral", "lightyellow", "lightgray", "lightpink", "lightcyan"].map((item) => (
          <Pressable
            key={item}
            style={[styles.colorBox, { backgroundColor: item }, color === item && styles.selectedColor]}
            onPress={() => setColor(item)}
          />
        ))}
      </View>

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <Pressable
            key={cat}
            style={[styles.categoryButton, category === cat && styles.selectedCategory]}
            onPress={() => setCategory(cat)}
          >
            <Text style={styles.categoryText}>{cat}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Tags</Text>
      <View style={styles.tagsContainer}>
        {tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
            <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
              <Text style={styles.removeTag}> ✕ </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={styles.tagInputContainer}>
        <TextInput
          style={styles.tagInput}
          placeholder="Add a tag"
          value={newTag}
          onChangeText={setNewTag}
        />
        <Pressable style={styles.addTagButton} onPress={handleAddTag}>
          <Text style={styles.addTagText}>Add</Text>
        </Pressable>
      </View>

      <Pressable style={styles.button} onPress={handleSaveToDo}>
        <Text style={styles.buttonText}>{existingTodo ? "Update To-Do" : "Add To-Do"}</Text>
      </Pressable>
    </View>
  );
};

export default AddToDo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    elevation: 2,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  datePicker: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
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
    color: "white",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    padding: 8,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    marginRight: 5,
  },
  removeTag: {
    color: "red",
    fontWeight: "bold",
  },
  tagInputContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  tagInput: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  addTagButton: {
    marginLeft: 10,
    backgroundColor: "green",
    padding: 10,
    borderRadius: 8,
  },
  addTagText: {
    color: "white",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  colorOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  colorBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedColor: {
    borderColor: "black",
  },
});
