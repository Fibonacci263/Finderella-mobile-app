import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

const LostItemForm = () => {
  const [values, setValues] = useState({
    itemname: "",
    date: "",
    location: "",
    email: "",
    contact: "",
    category: "",
    image: null, // Stores URI of the selected image
    description: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (name, value) => {
    setValues({ ...values, [name]: value });
  };

  const resetForm = () => {
    setValues({
      itemname: "",
      date: "",
      location: "",
      email: "",
      contact: "",
      category: "",
      image: null,
      description: "",
    });
    setSuccessMessage("");
    setErrorMessage("");
  };

  const pickImage = async () => {
    // Request permission to access the image gallery
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Permission to access gallery is required.");
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setValues({ ...values, image: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    if (
      !values.itemname ||
      !values.date ||
      !values.location ||
      !values.contact ||
      !values.category ||
      !values.description
    ) {
      Alert.alert("Validation Error", "Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.itemname);
    formData.append("date", values.date);
    formData.append("location", values.location);
    formData.append("email", values.email);
    formData.append("phone", values.contact);
    formData.append("category", values.category);
    formData.append("description", values.description);

    if (values.image) {
      formData.append("image", {
        uri: values.image,
        name: "image.jpg",
        type: "image/jpeg",
      });
    }

    try {
      const response = await fetch("http:192.168.234.45:5000/api/lost", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.ok) {
        setSuccessMessage("Lost item successfully reported!");
        resetForm();
      } else {
        setErrorMessage("Failed to report the lost item.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred while reporting the lost item.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Report Lost Item</Text>
      {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Item Name*"
        value={values.itemname}
        onChangeText={(text) => handleInputChange("itemname", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Date Lost*"
        value={values.date}
        onChangeText={(text) => handleInputChange("date", text)}
        onFocus={(e) => (e.target.type = "date")} // For web (or you can use a date picker package for native)
      />

      <TextInput
        style={styles.input}
        placeholder="Location Lost*"
        value={values.location}
        onChangeText={(text) => handleInputChange("location", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email (optional)"
        value={values.email}
        keyboardType="email-address"
        onChangeText={(text) => handleInputChange("email", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number*"
        value={values.contact}
        keyboardType="phone-pad"
        onChangeText={(text) => handleInputChange("contact", text)}
      />

      <View style={styles.picker}>
        <Picker
          selectedValue={values.category}
          onValueChange={(itemValue) => handleInputChange("category", itemValue)}
        >
          <Picker.Item label="Select Category*" value="" />
          <Picker.Item label="Electronics" value="Electronics" />
          <Picker.Item label="Clothing" value="Clothing" />
          <Picker.Item label="Jewellery" value="Jewellery" />
          <Picker.Item label="Documents" value="Documents" />
          <Picker.Item label="Miscellaneous" value="Miscellaneous" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>
          {values.image ? "Change Image" : "Upload Image"}
        </Text>
      </TouchableOpacity>

      {values.image && (
        <Text style={styles.imagePreview}>Selected Image: {values.image}</Text>
      )}

      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Description*"
        value={values.description}
        onChangeText={(text) => handleInputChange("description", text)}
        multiline
      />

      <View style={styles.buttonContainer}>
        <Button title="Reset" onPress={resetForm} color="#FF6347" />
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  picker: {
    backgroundColor: "#fff",
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  imagePicker: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  imagePickerText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imagePreview: {
    fontSize: 12,
    color: "#666",
    marginVertical: 10,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  success: {
    color: "green",
    textAlign: "center",
    marginBottom: 10,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default LostItemForm;
