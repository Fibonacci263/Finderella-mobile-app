import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import LostItemForm from '../screens/ReportLost'
import FoundForm from '../screens/ReportFound'

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

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;

  return (
    <View style={styles.container}>
      {/* Navigation Buttons */}
      <View style={styles.navButtons}>
        <Button
          title="Report Lost Item"
          color="#007bff"
          onPress={() => navigation.navigate("LostItemForm")}
        />
        <Button
          title="Report Found Item"
          color="#28a745"
          onPress={() => navigation.navigate("FoundForm")}
        />
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search items..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Items List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.noItems}>No items found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f4f4f9',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  card: {
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
    lineHeight: 20,
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
    color: '#aaa',
    fontStyle: 'italic',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
