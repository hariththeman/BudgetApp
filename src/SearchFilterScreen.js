import React, { useState, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Modal, Alert, FlatList, Animated, Easing,
} from "react-native";

// Sample data
const SAMPLE_DATA = [
  { id: "1", desc: "Coffee", category: "Food", amount: 5.50, date: "Dec 10" },
  { id: "2", desc: "Bus fare", category: "Transport", amount: 3.25, date: "Dec 10" },
  { id: "3", desc: "Textbook", category: "Education", amount: 89.99, date: "Dec 9" },
  { id: "4", desc: "Groceries", category: "Food", amount: 42.75, date: "Dec 8" },
  { id: "5", desc: "Gym", category: "Health", amount: 29.99, date: "Dec 7" },
];

// Custom Button
const CustomButton = ({ title, onPress, color = "#FFB74D", icon = "" }) => {
  const anim = useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.spring(anim, { toValue: 0.95, useNativeDriver: true }).start();
  const pressOut = () => Animated.spring(anim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <TouchableOpacity onPressIn={pressIn} onPressOut={pressOut} onPress={onPress}>
      <Animated.View style={[styles.button, { backgroundColor: color, transform: [{ scale: anim }] }]}>
        {icon ? <Text style={styles.btnIcon}>{icon}</Text> : null}
        <Text style={styles.btnText}>{title}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Main Component
export default function SearchFilterScreen() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [data, setData] = useState(SAMPLE_DATA);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Animation 1: Fade
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    
    // Animation 2: Slide
    Animated.spring(slideAnim, { toValue: 0, tension: 50, useNativeDriver: true }).start();
    
    // Animation 3: Rotate (looped)
    Animated.loop(
      Animated.timing(rotateAnim, { 
        toValue: 1, 
        duration: 3000, 
        easing: Easing.linear, 
        useNativeDriver: true 
      })
    ).start();
  }, []);

  // Filter function
  const applyFilter = () => {
    let results = SAMPLE_DATA.filter(item => 
      search === "" || item.desc.toLowerCase().includes(search.toLowerCase())
    );
    
    if (category !== "All") results = results.filter(item => item.category === category);
    
    setData(results);
    if (results.length === 0) {
      Alert.alert("No Results", "Try different search terms.");
    }
  };

  // Clear filters
  const clearAll = () => {
    setSearch("");
    setCategory("All");
    setData(SAMPLE_DATA);
  };

  // System alert
  const showSystemAlert = () => {
    Alert.alert("Budget Alert", "You're over budget in Food category!", [
      { text: "View", style: "default" },
      { text: "Dismiss", style: "cancel" }
    ]);
  };

  // Render item
  const renderItem = ({ item }) => (
    <Animated.View style={[styles.item, { opacity: fadeAnim }]}>
      <Text style={styles.itemIcon}>
        {item.category === "Food" ? "🍕" : 
         item.category === "Transport" ? "🚗" : 
         item.category === "Education" ? "📚" : "💼"}
      </Text>
      <View style={styles.itemContent}>
        <Text style={styles.itemDesc}>{item.desc}</Text>
        <Text style={styles.itemDetails}>{item.category} • {item.date}</Text>
      </View>
      <Text style={[styles.itemAmount, { color: item.amount > 50 ? "#FF7043" : "#81C784" }]}>
        ${item.amount.toFixed(2)}
      </Text>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.title}>🔍 Search Expenses</Text>
      </Animated.View>

      {/* Search */}
      <Animated.View style={[styles.searchBox, { transform: [{ translateY: slideAnim }] }]}>
        <Animated.View style={{ 
          transform: [{ 
            rotate: rotateAnim.interpolate({
              inputRange: [0, 1], 
              outputRange: ["0deg", "360deg"]
            })
          }] 
        }}>
          <Text style={styles.searchIcon}>🔍</Text>
        </Animated.View>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          value={search}
          onChangeText={setSearch}
        />
      </Animated.View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <CustomButton title="Search" onPress={applyFilter} color="#FFB74D" icon="🔎" />
        <CustomButton title="Clear" onPress={clearAll} color="#FF8A65" icon="🔄" />
        <CustomButton title="Alert" onPress={showSystemAlert} color="#81C784" icon="💰" />
        <CustomButton title="Filters" onPress={() => setShowFilterModal(true)} color="#64B5F6" icon="⚙️" />
        <CustomButton title="Modal" onPress={() => setShowAlertModal(true)} color="#BA68C8" icon="🔔" />
      </View>

      {/* Results */}
      <Text style={styles.resultText}>
        {category === "All" ? "All" : category} • {data.length} items
      </Text>

      {/* List */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        }
      />

      {/* Modal 1: Filter */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilterModal}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Filter by Category</Text>
            {["All", "Food", "Transport", "Education", "Health"].map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.option, category === cat && styles.optionActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.optionText, category === cat && styles.optionTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={styles.modalButtons}>
              <CustomButton title="Cancel" onPress={() => setShowFilterModal(false)} color="#B0BEC5" />
              <CustomButton title="Apply" onPress={() => { setShowFilterModal(false); applyFilter(); }} color="#FFB74D" />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal 2: Alert */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showAlertModal}
        onRequestClose={() => setShowAlertModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.alertModal}>
            <Text style={styles.alertTitle}>Great Job! 🎉</Text>
            <Text style={styles.alertText}>You're under budget this month!</Text>
            <View style={styles.alertButtons}>
              <CustomButton title="Close" onPress={() => setShowAlertModal(false)} color="#FF8A65" />
              <CustomButton title="Details" onPress={() => {
                setShowAlertModal(false);
                Alert.alert("Details", "Monthly report would show here.");
              }} color="#81C784" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8E1" },
  header: { padding: 20, backgroundColor: "#FFECB3", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#5D4037" },
  searchBox: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF",
    margin: 15, padding: 12, borderRadius: 25, elevation: 2,
  },
  searchIcon: { fontSize: 20, color: "#FF9800", marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: "#5D4037" },
  buttonRow: { 
    flexDirection: "row", justifyContent: "space-around", 
    marginHorizontal: 15, marginBottom: 15, flexWrap: "wrap" 
  },
  button: { 
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, 
    margin: 5, minWidth: 90,
  },
  btnIcon: { fontSize: 14, marginRight: 5 },
  btnText: { color: "#5D4037", fontSize: 13, fontWeight: "600" },
  resultText: { textAlign: "center", color: "#8D6E63", marginBottom: 10, fontSize: 14 },
  list: { flex: 1, paddingHorizontal: 15 },
  item: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#FFFFFF", padding: 15, borderRadius: 15,
    marginBottom: 10, elevation: 1,
  },
  itemIcon: { fontSize: 24, marginRight: 15 },
  itemContent: { flex: 1 },
  itemDesc: { fontSize: 16, fontWeight: "600", color: "#5D4037", marginBottom: 3 },
  itemDetails: { fontSize: 13, color: "#8D6E63" },
  itemAmount: { fontSize: 18, fontWeight: "bold" },
  empty: { alignItems: "center", paddingVertical: 40 },
  emptyText: { fontSize: 16, color: "#8D6E63" },
  modalOverlay: { 
    flex: 1, backgroundColor: "rgba(0,0,0,0.5)", 
    justifyContent: "center", alignItems: "center", padding: 20 
  },
  modal: { 
    backgroundColor: "#FFFFFF", borderRadius: 20, 
    padding: 20, width: "85%", maxWidth: 350 
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#5D4037", marginBottom: 15 },
  option: { padding: 12, borderRadius: 10, backgroundColor: "#F5F5F5", marginBottom: 8 },
  optionActive: { backgroundColor: "#FFB74D" },
  optionText: { fontSize: 16, textAlign: "center", color: "#333" },
  optionTextActive: { color: "#FFF", fontWeight: "600" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  alertModal: { 
    backgroundColor: "#FFFFFF", borderRadius: 20, 
    padding: 25, width: "80%", alignItems: "center" 
  },
  alertTitle: { fontSize: 22, fontWeight: "bold", color: "#5D4037", marginBottom: 10 },
  alertText: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 20 },
  alertButtons: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
});