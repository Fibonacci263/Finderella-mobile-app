import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "react-native-image-picker";

const FoundForm = () => {
  const [values, setValues] = useState({
    itemname: "",
    date: "",
    location: "",
    email: "",
    contact: "",
    category: "",
    image: null, // To handle image file
    description: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (field, value) => {
    setValues({ ...values, [field]: value });
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: "photo",
      quality: 0.8,
    });

    if (!result.didCancel && result.assets && result.assets[0]) {
      setValues({ ...values, image: result.assets[0].uri });
    }
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

  const handleSubmit = async () => {
    if (
      !values.itemname ||
      !values.date ||
      !values.location ||
      !values.email ||
      !values.contact ||
      !values.category ||
      !values.description
    ) {
      Alert.alert("Error", "Please fill out all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.itemname);
    formData.append("description", values.description);
    formData.append("category", values.category);
    formData.append("location", values.location);
    formData.append("email", values.email);
    formData.append("phone", values.contact);

    if (values.image) {
      formData.append("image", {
        uri: values.image,
        name: "image.jpg",
        type: "image/jpeg",
      });
    }

    try {
      const response = await fetch("http:192.168.234.45:5000/api/found", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.ok) {
        setSuccessMessage("Found item successfully reported!");
        resetForm();
      } else {
        setErrorMessage("Failed to report the found item.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("An error occurred while reporting the found item.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Report Found Item</Text>
      {successMessage ? <Text style={styles.successMessage}>{successMessage}</Text> : null}
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Item Name*"
        value={values.itemname}
        onChangeText={(text) => handleInputChange("itemname", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Date Found*"
        value={values.date}
        onChangeText={(text) => handleInputChange("date", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Location Found*"
        value={values.location}
        onChangeText={(text) => handleInputChange("location", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email*"
        value={values.email}
        onChangeText={(text) => handleInputChange("email", text)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number*"
        value={values.contact}
        onChangeText={(text) => handleInputChange("contact", text)}
        keyboardType="phone-pad"
      />

      <Picker
        selectedValue={values.category}
        style={styles.picker}
        onValueChange={(itemValue) => handleInputChange("category", itemValue)}
      >
        <Picker.Item label="Select Category*" value="" />
        <Picker.Item label="Electronics" value="Electronics" />
        <Picker.Item label="Clothing" value="Clothing" />
        <Picker.Item label="Jewellery" value="Jewellery" />
        <Picker.Item label="Documents" value="Documents" />
        <Picker.Item label="Miscellaneous" value="Miscellaneous" />
      </Picker>

      <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePick}>
        <Text style={styles.imagePickerText}>
          {values.image ? "Change Image" : "Pick an Image"}
        </Text>
      </TouchableOpacity>

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description*"
        value={values.description}
        onChangeText={(text) => handleInputChange("description", text)}
        multiline
        numberOfLines={4}
      />

      <View style={styles.buttonContainer}>
        <Button title="Reset" onPress={resetForm} color="#f39c12" />
        <Button title="Submit" onPress={handleSubmit} color="#2980b9" />
      </View>
    </ScrollView>
  );
};

export default FoundForm;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  textArea: {
    height: 100,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  imagePickerButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  imagePickerText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  successMessage: {
    color: "green",
    textAlign: "center",
    marginBottom: 10,
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});
