import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';



import ReportLost from '../screens/ReportLost';
import ReportFound from '../screens/ReportFound';


// Home Component
const Home = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch items from the backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items');
        if (!response.ok) throw new Error('Failed to fetch items');

        const data = await response.json();
        setItems(data);
        setFilteredItems(data);
      } catch (err) {
        Alert.alert('Error', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Handle search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredItems(items);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = items.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery)
      );
      setFilteredItems(filtered);
    }
  };

  // Render item card
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      
      
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.details}>
        <Text style={styles.bold}>Category:</Text> {item.category}
      </Text>
      <Text style={styles.details}>
        <Text style={styles.bold}>Location:</Text> {item.location}
      </Text>
      <Text style={styles.details}>
        <Text style={styles.bold}>Date:</Text>{' '}
        {new Date(item.date).toLocaleDateString()}
      </Text>
      <Text style={styles.details}>
        <Text style={styles.bold}>Contact:</Text> {item.email}
      </Text>
    </View>
  );

  // Navigate to the report options
  const handleMenu = () => {
    Alert.alert(
      'Report',
      'What would you like to report?',
      [
        { text: 'Lost Item', onPress: () => navigation.navigate(ReportLost) },
        { text: 'Found Item', onPress: () => navigation.navigate(ReportFound) },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search items..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.noItems}>No items found</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={handleMenu}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f4f4f9', // Light background for better contrast
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff', // White background for search input
    fontSize: 16,
    color: '#333', // Darker text for better readability
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // For Android shadow effect
  },
  card: {
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff', // White background for cards
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3, // Android shadow effect
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: 'cover', // Ensures images are properly scaled
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333', // Darker text for a more professional feel
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#555', // Subtle text color for descriptions
    marginVertical: 5,
    lineHeight: 20, // Adds spacing between lines for better readability
  },
  details: {
    fontSize: 13,
    color: '#777',
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  noItems: {
    textAlign: 'center',
    fontSize: 16,
    color: '#aaa', // Softer color for the 'no items' text
    fontStyle: 'italic', // Adds a professional touch
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#007bff', // Strong, vibrant color for the FAB
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default Home;
