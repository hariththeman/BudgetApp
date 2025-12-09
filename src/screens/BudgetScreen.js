import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";

// Example data for demo
const TEST_EXPENSES = [
  { id: "exp-1", userId: "user-123", amount: 84.5, category: "Food" },
  { id: "exp-2", userId: "user-123", amount: 15.0, category: "Transport" },
  { id: "exp-3", userId: "user-123", amount: 63.0, category: "Entertainment" },
  { id: "exp-4", userId: "user-123", amount: 26.0, category: "Subscription" },
  { id: "exp-5", userId: "user-123", amount: 32.75, category: "Food" },
  { id: "exp-6", userId: "user-123", amount: 25.0, category: "Transport" },
  { id: "exp-7", userId: "user-123", amount: 169.0, category: "Shopping" },
  { id: "exp-8", userId: "user-123", amount: 17.5, category: "Subscription" },
  { id: "exp-9", userId: "user-123", amount: 23.5, category: "Subscription" },
  { id: "exp-10", userId: "user-123", amount: 30.0, category: "Subscription" },
  { id: "exp-11", userId: "user-123", amount: 51.75, category: "Shopping" },
];

const TEST_BUDGETS = [
  {
    id: "budget-1",
    userId: "user-123",
    month: 12,
    year: 2025,
    category: "Food",
    amount: 250.0,
  },
  {
    id: "budget-2",
    userId: "user-123",
    month: 12,
    year: 2025,
    category: "Transport",
    amount: 100.0,
  },
  {
    id: "budget-3",
    userId: "user-123",
    month: 12,
    year: 2025,
    category: "Entertainment",
    amount: 150.0,
  },
  {
    id: "budget-4",
    userId: "user-123",
    month: 12,
    year: 2025,
    category: "Subscription",
    amount: 100.0,
  },
];

// Get unique categories from expenses
function getCategories(expenses) {
  const categories = new Set();
  expenses.forEach((expense) => categories.add(expense.category));
  return Array.from(categories).sort();
}

// BudgetScreen that will set monthly budgets for each category
export default function BudgetScreen({ userId }) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Demo loading delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get categories from test expenses
      const categoryList = getCategories(TEST_EXPENSES);
      setCategories(categoryList);

      // Load existing budgets
      const budgetObject = {};
      TEST_BUDGETS.forEach((budget) => {
        budgetObject[budget.category] = budget.amount.toString();
      });
      setBudgets(budgetObject);
    } catch (error) {
      Alert.alert("Error", "Could not load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetChange = (category, value) => {
    setBudgets((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Demo loading delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      Alert.alert("Success!", "Your budgets have been saved!");
    } catch (error) {
      Alert.alert("Error", "Could not save budgets.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4caf50" />
        <Text style={styles.loadingText}>Loading your budgets...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Set Your Budget 💰</Text>
        <Text style={styles.subtitle}>December {currentYear}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Set spending limits for each category to help control your expenses.
        </Text>
      </View>

      <View style={styles.section}>
        {categories.length === 0 ? (
          <Text style={styles.emptyText}>
            No categories yet! Add some expenses first.
          </Text>
        ) : (
          categories.map((category) => (
            <View key={category} style={styles.budgetRow}>
              <Text style={styles.categoryLabel}>{category}</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.dollarSign}>$</Text>
                <TextInput
                  style={styles.input}
                  value={budgets[category] || ""}
                  onChangeText={(value) => handleBudgetChange(category, value)}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="#959595ff"
                />
              </View>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#ffffffff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Budgets</Text>
        )}
      </TouchableOpacity>

      <View style={styles.tipsBox}>
        <Text style={styles.tipsTitle}>Tips:</Text>
        <Text style={styles.tipsText}>
          • Set realistic budgets based on your income{"\n"}• Review your
          spending breakdown to adjust budgets
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f5e9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#1b5e20",
  },
  header: {
    backgroundColor: "#4caf50",
    padding: 20,
    paddingTop: 60,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffffff",
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    marginTop: 5,
  },
  infoBox: {
    backgroundColor: "#ffffffff",
    margin: 15,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#4caf50",
  },
  infoText: {
    fontSize: 14,
    color: "#313131ff",
    lineHeight: 20,
  },
  section: {
    backgroundColor: "#ffffffff",
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },
  emptyText: {
    fontSize: 14,
    color: "#959595ff",
    textAlign: "center",
    padding: 20,
  },
  budgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ecececff",
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#313131ff",
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5ff",
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#dfdfdfff",
  },
  dollarSign: {
    fontSize: 16,
    color: "#666666ff",
    marginRight: 5,
  },
  input: {
    fontSize: 16,
    color: "#313131ff",
    padding: 10,
    width: 80,
    textAlign: "right",
  },
  saveButton: {
    backgroundColor: "#4caf50",
    margin: 15,
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#acacacff",
  },
  saveButtonText: {
    color: "#ffffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  tipsBox: {
    backgroundColor: "#ffffffff",
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 10,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1b5e20",
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: "#666666ff",
    lineHeight: 22,
  },
});
