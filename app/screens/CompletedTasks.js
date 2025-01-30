import { 
    View, Text, StyleSheet, FlatList, TouchableOpacity, Alert 
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { FirestoreDB } from "../../FirebaseConfig";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const CompletedTasks = ({ navigation }) => {
    const [completedTodos, setCompletedTodos] = useState([]);

    const fetchCompletedTodos = async () => {
        try {
            const q = query(collection(FirestoreDB, "todos"), where("completed", "==", true));
            const querySnapshot = await getDocs(q);
            const todoList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCompletedTodos(todoList);
        } catch (error) {
            console.error("Error fetching completed todos:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCompletedTodos();
        }, [])
    );

    const handleRestore = async (id) => {
        try {
            await updateDoc(doc(FirestoreDB, "todos", id), { completed: false });
            setCompletedTodos(completedTodos.filter(todo => todo.id !== id));
        } catch (error) {
            console.error("Error restoring todo:", error);
        }
    };

    const handleDelete = async (id) => {
        Alert.alert("Delete Completed Task", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Delete", 
                onPress: async () => {
                    try {
                        await deleteDoc(doc(FirestoreDB, "todos", id));
                        setCompletedTodos(completedTodos.filter(todo => todo.id !== id));
                    } catch (error) {
                        console.error("Error deleting todo:", error);
                    }
                }, 
                style: "destructive"
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Completed Tasks</Text>
            <FlatList
                data={completedTodos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.todoTitle}>{item.name}</Text>
                        <Text style={styles.todoDate}>{item.date}</Text>
                        <Text style={styles.todoDescription}>{item.description}</Text>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity onPress={() => handleRestore(item.id)} style={styles.restoreButton}>
                                <Ionicons name="refresh-outline" size={24} color="blue" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                                <Ionicons name="trash-outline" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

export default CompletedTasks;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
        padding: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "white",
        padding: 20,
        marginVertical: 10,
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
    restoreButton: {
        marginRight: 10,
    },
    deleteButton: {
        marginLeft: 10,
    },
});
