package com.pedrocasseb.fluxo.analytics;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.pedrocasseb.fluxo.analytics.dto.*;
import com.pedrocasseb.fluxo.category.Category;
import com.pedrocasseb.fluxo.category.CategoryType;
import com.pedrocasseb.fluxo.subscription.SubscriptionService;
import com.pedrocasseb.fluxo.transaction.FinancialTransaction;
import com.pedrocasseb.fluxo.transaction.TransactionRepository;
import com.pedrocasseb.fluxo.user.User;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class DashboardServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private SubscriptionService subscriptionService;

    @InjectMocks
    private DashboardService dashboardService;

    private User testUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        testUser = new User();
        testUser.setName("Pedro");
        testUser.setEmail("pedro@example.com");
    }

    private FinancialTransaction transaction(
            String description, BigDecimal amount, LocalDate date, User user, Category category) {
        FinancialTransaction transaction = new FinancialTransaction();
        transaction.setDescription(description);
        transaction.setAmount(amount);
        transaction.setTransactionDate(date);
        transaction.setUser(user);
        transaction.setCategory(category);
        return transaction;
    }

    @Test
    void getDashboard_ShouldCalculateSummaryCorrectly() {
        LocalDate now = LocalDate.now();

        // Categories
        Category incomeCat = new Category(null, "Salário", CategoryType.INCOME, testUser, new ArrayList<>());
        Category expenseCat = new Category(null, "Alimentação", CategoryType.EXPENSE, testUser, new ArrayList<>());
        Category investmentCat = new Category(null, "Ações", CategoryType.INVESTMENT, testUser, new ArrayList<>());

        // Transactions
        FinancialTransaction tx1 = transaction("Salário", BigDecimal.valueOf(5000.0), now, testUser, incomeCat);
        FinancialTransaction tx2 = transaction("Mercado", BigDecimal.valueOf(1500.0), now, testUser, expenseCat);
        FinancialTransaction tx3 = transaction("Investimento", BigDecimal.valueOf(500.0), now, testUser, investmentCat);

        when(transactionRepository.findByUser(testUser)).thenReturn(List.of(tx1, tx2, tx3));

        DashboardResponse response = dashboardService.getDashboard(testUser);

        assertNotNull(response);
        
        // Summary calculations
        // balance = income - expense - investment = 5000 - 1500 - 500 = 3000
        // saving = income - expense - investment = 3000
        assertEquals(0, response.summary().balance().compareTo(BigDecimal.valueOf(3000.0)));
        assertEquals(0, response.summary().income().compareTo(BigDecimal.valueOf(5000.0)));
        assertEquals(0, response.summary().expense().compareTo(BigDecimal.valueOf(1500.0)));
        assertEquals(0, response.summary().investment().compareTo(BigDecimal.valueOf(500.0)));
        assertEquals(0, response.summary().saving().compareTo(BigDecimal.valueOf(3000.0)));
    }

    @Test
    void getDashboard_ShouldCalculateComparisonsCorrectly() {
        LocalDate now = LocalDate.now();
        LocalDate lastMonth = now.minusMonths(1);

        Category incomeCat = new Category(null, "Salário", CategoryType.INCOME, testUser, new ArrayList<>());
        Category expenseCat = new Category(null, "Alimentação", CategoryType.EXPENSE, testUser, new ArrayList<>());

        // Current month
        FinancialTransaction curIncome = transaction("Salário", BigDecimal.valueOf(6000.0), now, testUser, incomeCat);
        FinancialTransaction curExpense = transaction("Alimentação", BigDecimal.valueOf(2000.0), now, testUser, expenseCat);

        // Previous month
        FinancialTransaction prevIncome = transaction("Salário", BigDecimal.valueOf(5000.0), lastMonth, testUser, incomeCat);
        FinancialTransaction prevExpense = transaction("Alimentação", BigDecimal.valueOf(1600.0), lastMonth, testUser, expenseCat);

        when(transactionRepository.findByUser(testUser)).thenReturn(List.of(curIncome, curExpense, prevIncome, prevExpense));

        DashboardResponse response = dashboardService.getDashboard(testUser);

        assertNotNull(response);

        // Income comparison: current=6000, previous=5000 -> diff=1000, percentage=20%
        ComparisonDetail incComp = response.comparisons().income();
        assertEquals(0, incComp.current().compareTo(BigDecimal.valueOf(6000.0)));
        assertEquals(0, incComp.previous().compareTo(BigDecimal.valueOf(5000.0)));
        assertEquals(0, incComp.difference().compareTo(BigDecimal.valueOf(1000.0)));
        assertEquals(20.0, incComp.percentage());

        // Expense comparison: current=2000, previous=1600 -> diff=400, percentage=25%
        ComparisonDetail expComp = response.comparisons().expense();
        assertEquals(0, expComp.current().compareTo(BigDecimal.valueOf(2000.0)));
        assertEquals(0, expComp.previous().compareTo(BigDecimal.valueOf(1600.0)));
        assertEquals(0, expComp.difference().compareTo(BigDecimal.valueOf(400.0)));
        assertEquals(25.0, expComp.percentage());
    }

    @Test
    void getDashboard_ShouldGroupExpensesByCategoryCorrectly() {
        LocalDate now = LocalDate.now();

        Category foodCat = new Category(null, "Alimentação", CategoryType.EXPENSE, testUser, new ArrayList<>());
        Category transportCat = new Category(null, "Transporte", CategoryType.EXPENSE, testUser, new ArrayList<>());

        FinancialTransaction food1 = transaction("Restaurante", BigDecimal.valueOf(300.0), now, testUser, foodCat);
        FinancialTransaction food2 = transaction("Mercado", BigDecimal.valueOf(700.0), now, testUser, foodCat);
        FinancialTransaction trans1 = transaction("Combustível", BigDecimal.valueOf(500.0), now, testUser, transportCat);

        when(transactionRepository.findByUser(testUser)).thenReturn(List.of(food1, food2, trans1));

        DashboardResponse response = dashboardService.getDashboard(testUser);

        assertNotNull(response);
        List<CategoryExpenseDetail> categories = response.expensesByCategory();
        
        // Total expense = 300 + 700 + 500 = 1500
        // Alimentação = 1000 -> 66.67%
        // Transporte = 500 -> 33.33%
        assertEquals(2, categories.size());
        assertEquals("Alimentação", categories.get(0).category());
        assertEquals(0, categories.get(0).amount().compareTo(BigDecimal.valueOf(1000.0)));
        assertEquals(66.67, categories.get(0).percentage());

        assertEquals("Transporte", categories.get(1).category());
        assertEquals(0, categories.get(1).amount().compareTo(BigDecimal.valueOf(500.0)));
        assertEquals(33.33, categories.get(1).percentage());
    }

    @Test
    void getDashboard_ShouldCalculateMonthlyEvolutionCorrectly() {
        LocalDate jan = LocalDate.of(2026, 1, 15);
        LocalDate feb = LocalDate.of(2026, 2, 10);

        Category incomeCat = new Category(null, "Salário", CategoryType.INCOME, testUser, new ArrayList<>());
        Category expenseCat = new Category(null, "Alimentação", CategoryType.EXPENSE, testUser, new ArrayList<>());

        FinancialTransaction tx1 = transaction("Salário Jan", BigDecimal.valueOf(5000.0), jan, testUser, incomeCat);
        FinancialTransaction tx2 = transaction("Mercado Jan", BigDecimal.valueOf(2000.0), jan, testUser, expenseCat);
        FinancialTransaction tx3 = transaction("Salário Fev", BigDecimal.valueOf(5500.0), feb, testUser, incomeCat);
        FinancialTransaction tx4 = transaction("Mercado Fev", BigDecimal.valueOf(2200.0), feb, testUser, expenseCat);

        when(transactionRepository.findByUser(testUser)).thenReturn(List.of(tx1, tx2, tx3, tx4));

        DashboardResponse response = dashboardService.getDashboard(testUser);

        assertNotNull(response);
        List<MonthlyEvolutionDetail> evolution = response.monthlyEvolution();

        assertEquals(2, evolution.size());
        assertEquals("2026-01", evolution.get(0).month());
        assertEquals(0, evolution.get(0).income().compareTo(BigDecimal.valueOf(5000.0)));
        assertEquals(0, evolution.get(0).expense().compareTo(BigDecimal.valueOf(2000.0)));
        assertEquals(0, evolution.get(0).saving().compareTo(BigDecimal.valueOf(3000.0)));

        assertEquals("2026-02", evolution.get(1).month());
        assertEquals(0, evolution.get(1).income().compareTo(BigDecimal.valueOf(5500.0)));
        assertEquals(0, evolution.get(1).expense().compareTo(BigDecimal.valueOf(2200.0)));
        assertEquals(0, evolution.get(1).saving().compareTo(BigDecimal.valueOf(3300.0)));
    }

    @Test
    void getDashboard_ShouldGenerateInsightsCorrectly() {
        LocalDate now = LocalDate.now();
        LocalDate lastMonth = now.minusMonths(1);

        Category incomeCat = new Category(null, "Salário", CategoryType.INCOME, testUser, new ArrayList<>());
        Category expenseCat = new Category(null, "Alimentação", CategoryType.EXPENSE, testUser, new ArrayList<>());
        Category investmentCat = new Category(null, "Ações", CategoryType.INVESTMENT, testUser, new ArrayList<>());

        FinancialTransaction tx1 = transaction("Salário", BigDecimal.valueOf(5000.0), now, testUser, incomeCat);
        FinancialTransaction tx2 = transaction("Mercado Grande", BigDecimal.valueOf(650.0), now, testUser, expenseCat);
        FinancialTransaction tx3 = transaction("Investimento", BigDecimal.valueOf(300.0), now, testUser, investmentCat);

        FinancialTransaction txPrev1 = transaction("Salário", BigDecimal.valueOf(4500.0), lastMonth, testUser, incomeCat);
        FinancialTransaction txPrev2 = transaction("Mercado", BigDecimal.valueOf(550.0), lastMonth, testUser, expenseCat);
        FinancialTransaction txPrev3 = transaction("Investimento", BigDecimal.valueOf(250.0), lastMonth, testUser, investmentCat);

        when(transactionRepository.findByUser(testUser)).thenReturn(List.of(tx1, tx2, tx3, txPrev1, txPrev2, txPrev3));

        DashboardResponse response = dashboardService.getDashboard(testUser);

        assertNotNull(response);
        assertNotNull(response.insights());
        assertFalse(response.insights().isEmpty());

        // Let's assert some sample insight string structures
        assertTrue(response.insights().stream().anyMatch(i -> i.contains("Você realizou 3 transações neste mês.")));
        assertTrue(response.insights().stream().anyMatch(i -> i.contains("Mercado Grande")));
    }
}
