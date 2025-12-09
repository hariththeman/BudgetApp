import React, { useState, useEffect } from "react";
import {
  View,
  Text,
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

// Helper functions
function calculateCategoryTotals(expenses) {
  const totals = {};
  expenses.forEach((expense) => {
    const category = expense.category;
    const amount = parseFloat(expense.amount);
    totals[category] = (totals[category] || 0) + amount;
  });
  return totals;
}

function calculateTotalSpent(expenses) {
  let total = 0;
  expenses.forEach((expense) => {
    total += parseFloat(expense.amount);
  });
  return total;
}

/**
 * SpendingBreakdown that will show spending by category
 */
export default function SpendingBreakdown({ userId }) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const [categoryTotals, setCategoryTotals] = useState({});
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Demo loading delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Calculate totals
      const totals = calculateCategoryTotals(TEST_EXPENSES);
      setCategoryTotals(totals);

      const total = calculateTotalSpent(TEST_EXPENSES);
      setTotalSpent(total);

      // Check for overspending
      checkOverspending(totals);
    } catch (error) {
      Alert.alert("Error", "Could not load spending data.");
    } finally {
      setLoading(false);
    }
  };

  const checkOverspending = (totals) => {
    const overCategories = [];

    Object.keys(totals).forEach((category) => {
      const spent = totals[category];
      const budget = TEST_BUDGETS.find((b) => b.category === category);

      if (budget && spent > budget.amount) {
        const overAmount = spent - budget.amount;
        overCategories.push(`${category}: $${overAmount.toFixed(2)} over`);
      }
    });

    if (overCategories.length > 0) {
      Alert.alert(
        "⚠️ Budget Alert!",
        `You're over budget in:\n\n${overCategories.join("\n")}`,
        [{ text: "OK" }]
      );
    }
  };

  const renderProgressBar = (spent, budget) => {
    const percentage = Math.min((spent / budget) * 100, 100);
    const over = spent > budget;

    return (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${percentage}%` },
              over && styles.progressBarRed,
            ]}
          />
        </View>
        <Text style={[styles.percentText, over && styles.percentTextRed]}>
          {percentage.toFixed(0)}%
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4caf50" />
        <Text style={styles.loadingText}>Loading your spending...</Text>
      </View>
    );
  }

  if (Object.keys(categoryTotals).length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Expenses Yet</Text>
        <Text style={styles.emptyText}>
          Start tracking your expenses today to see your spending breakdown!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Spending Breakdown 📊</Text>
        <Text style={styles.subtitle}>December {currentYear}</Text>
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Spent This Month</Text>
        <Text style={styles.totalAmount}>${totalSpent.toFixed(2)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>By Category</Text>

        {Object.keys(categoryTotals)
          .sort((a, b) => categoryTotals[b] - categoryTotals[a])
          .map((category) => {
            const spent = categoryTotals[category];
            const budget = TEST_BUDGETS.find((b) => b.category === category);
            const over = budget && spent > budget.amount;

            return (
              <View
                key={category}
                style={[styles.categoryCard, over && styles.categoryCardRed]}
              >
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{category}</Text>
                  {over && (
                    <View style={styles.warningBadge}>
                      <Text style={styles.warningText}>⚠️ OVER</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.spentAmount}>${spent.toFixed(2)}</Text>

                {budget ? (
                  <>
                    <Text style={styles.budgetText}>
                      Budget: ${budget.amount.toFixed(2)}
                    </Text>

                    {renderProgressBar(spent, budget.amount)}

                    <Text
                      style={[styles.remainingText, over && styles.overText]}
                    >
                      {over
                        ? `$${(spent - budget.amount).toFixed(2)} over budget`
                        : `$${(budget.amount - spent).toFixed(2)} remaining`}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.noBudgetText}>No budget set</Text>
                )}
              </View>
            );
          })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Visual Comparison</Text>
        {Object.keys(categoryTotals)
          .sort((a, b) => categoryTotals[b] - categoryTotals[a])
          .map((category) => {
            const spent = categoryTotals[category];
            const maxSpent = Math.max(...Object.values(categoryTotals));
            const barWidth = (spent / maxSpent) * 100;
            const budget = TEST_BUDGETS.find((b) => b.category === category);
            const over = budget && spent > budget.amount;

            return (
              <View key={category} style={styles.chartRow}>
                <Text style={styles.chartLabel}>{category}</Text>
                <View style={styles.chartBarBackground}>
                  <View
                    style={[
                      styles.chartBar,
                      { width: `${barWidth}%` },
                      over && styles.chartBarRed,
                    ]}
                  />
                </View>
                <Text style={styles.chartValue}>${spent.toFixed(0)}</Text>
              </View>
            );
          })}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#e8f5e9",
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1b5e20",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#2e7d32",
    textAlign: "center",
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
    color: "#ffffffff",
    marginTop: 5,
  },
  totalCard: {
    backgroundColor: "#ffffffff",
    margin: 15,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4caf50",
  },
  totalLabel: {
    fontSize: 14,
    color: "#666666ff",
    marginBottom: 5,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4caf50",
  },
  section: {
    backgroundColor: "#ffffffff",
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1b5e20",
    marginBottom: 15,
  },
  categoryCard: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  categoryCardRed: {
    borderColor: "#f44336",
    backgroundColor: "#ffebee",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#313131ff",
  },
  warningBadge: {
    backgroundColor: "#f44336",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  warningText: {
    color: "#ffffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  spentAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4caf50",
    marginBottom: 5,
  },
  budgetText: {
    fontSize: 14,
    color: "#666666ff",
    marginBottom: 10,
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  progressBarBackground: {
    flex: 1,
    height: 16,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4caf50",
    borderRadius: 8,
  },
  progressBarRed: {
    backgroundColor: "#f44336",
  },
  percentText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "#4caf50",
    minWidth: 45,
    textAlign: "right",
  },
  percentTextRed: {
    color: "#f44336",
  },
  remainingText: {
    fontSize: 14,
    color: "#4caf50",
    fontWeight: "600",
  },
  overText: {
    color: "#f44336",
  },
  noBudgetText: {
    fontSize: 14,
    color: "#9a9a9aff",
    fontStyle: "italic",
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  chartLabel: {
    fontSize: 12,
    color: "#666666ff",
    width: 70,
  },
  chartBarBackground: {
    flex: 1,
    height: 20,
    backgroundColor: "#e1e1e1ff",
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  chartBar: {
    height: "100%",
    backgroundColor: "#4caf50",
    borderRadius: 4,
  },
  chartBarRed: {
    backgroundColor: "#f44336",
  },
  chartValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#313131ff",
    width: 50,
    textAlign: "right",
  },
});
