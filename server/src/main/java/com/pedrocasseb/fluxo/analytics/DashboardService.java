package com.pedrocasseb.fluxo.analytics;

import com.pedrocasseb.fluxo.analytics.dto.*;
import com.pedrocasseb.fluxo.category.CategoryType;
import com.pedrocasseb.fluxo.subscription.SubscriptionService;
import com.pedrocasseb.fluxo.transaction.FinancialTransaction;
import com.pedrocasseb.fluxo.transaction.PaymentMethod;
import com.pedrocasseb.fluxo.transaction.TransactionRepository;
import com.pedrocasseb.fluxo.user.User;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

  private final TransactionRepository transactionRepository;
  private final SubscriptionService subscriptionService;

  @Transactional
  public DashboardResponse getDashboard(User user) {
    subscriptionService.syncDueTransactions(user);

    LocalDate now = LocalDate.now();

    // Parcelas de compras parceladas com vencimento futuro ainda não foram pagas —
    // só entram no resumo/saldo/gráficos quando a data delas chegar.
    List<FinancialTransaction> allTransactions = transactionRepository.findByUser(user).stream()
        .filter(tx -> !tx.getTransactionDate().isAfter(now))
        .toList();

    int currentMonthValue = now.getMonthValue();
    int currentYearValue = now.getYear();

    LocalDate previousMonthDate = now.minusMonths(1);
    int previousMonthValue = previousMonthDate.getMonthValue();
    int previousMonthYear = previousMonthDate.getYear();

    // 1. Resumo Financeiro (Geral/Acumulado)
    BigDecimal totalIncome = sumByType(allTransactions, CategoryType.INCOME);
    BigDecimal totalExpense = sumByType(allTransactions, CategoryType.EXPENSE);
    BigDecimal totalInvestment = sumByType(allTransactions, CategoryType.INVESTMENT);
    BigDecimal totalSaving = totalIncome.subtract(totalExpense).subtract(totalInvestment);
    BigDecimal totalBalance = totalIncome.subtract(totalExpense).subtract(totalInvestment);

    DashboardSummary summary = new DashboardSummary(
        totalBalance,
        totalIncome,
        totalExpense,
        totalInvestment,
        totalSaving
    );

    // 2. Transações dos meses atual e anterior
    List<FinancialTransaction> currentMonthTx = allTransactions.stream()
        .filter(tx -> tx.getTransactionDate().getYear() == currentYearValue 
            && tx.getTransactionDate().getMonthValue() == currentMonthValue)
        .toList();

    List<FinancialTransaction> previousMonthTx = allTransactions.stream()
        .filter(tx -> tx.getTransactionDate().getYear() == previousMonthYear 
            && tx.getTransactionDate().getMonthValue() == previousMonthValue)
        .toList();

    // Comparações
    ComparisonDetail incomeComparison = calculateComparison(
        sumByType(currentMonthTx, CategoryType.INCOME),
        sumByType(previousMonthTx, CategoryType.INCOME)
    );

    ComparisonDetail expenseComparison = calculateComparison(
        sumByType(currentMonthTx, CategoryType.EXPENSE),
        sumByType(previousMonthTx, CategoryType.EXPENSE)
    );

    ComparisonDetail investmentComparison = calculateComparison(
        sumByType(currentMonthTx, CategoryType.INVESTMENT),
        sumByType(previousMonthTx, CategoryType.INVESTMENT)
    );

    BigDecimal currentMonthSaving = sumByType(currentMonthTx, CategoryType.INCOME)
        .subtract(sumByType(currentMonthTx, CategoryType.EXPENSE))
        .subtract(sumByType(currentMonthTx, CategoryType.INVESTMENT));

    BigDecimal previousMonthSaving = sumByType(previousMonthTx, CategoryType.INCOME)
        .subtract(sumByType(previousMonthTx, CategoryType.EXPENSE))
        .subtract(sumByType(previousMonthTx, CategoryType.INVESTMENT));

    ComparisonDetail savingComparison = calculateComparison(
        currentMonthSaving,
        previousMonthSaving
    );

    DashboardComparisons comparisons = new DashboardComparisons(
        incomeComparison,
        expenseComparison,
        investmentComparison,
        savingComparison
    );

    // 3. Gastos por Categoria (Apenas Despesas de todo o histórico)
    List<FinancialTransaction> allExpenses = allTransactions.stream()
        .filter(tx -> tx.getCategory() != null && tx.getCategory().getType() == CategoryType.EXPENSE)
        .toList();

    BigDecimal totalExpensesAllTime = allExpenses.stream()
        .map(FinancialTransaction::getAmount)
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    Map<String, BigDecimal> expensesByCategoryMap = allExpenses.stream()
        .collect(Collectors.groupingBy(
            tx -> tx.getCategory().getName(),
            Collectors.reducing(BigDecimal.ZERO, FinancialTransaction::getAmount, BigDecimal::add)
        ));

    List<CategoryExpenseDetail> expensesByCategory = expensesByCategoryMap.entrySet().stream()
        .map(entry -> {
          double percentage = 0.0;
          if (totalExpensesAllTime.compareTo(BigDecimal.ZERO) > 0) {
            percentage = entry.getValue()
                .multiply(BigDecimal.valueOf(100))
                .divide(totalExpensesAllTime, 2, RoundingMode.HALF_UP)
                .doubleValue();
          }
          return new CategoryExpenseDetail(entry.getKey(), entry.getValue(), percentage);
        })
        .sorted(Comparator.comparing(CategoryExpenseDetail::amount).reversed())
        .toList();

    // 3.1 Gastos por Método de Pagamento (Apenas Despesas de todo o histórico)
    Map<PaymentMethod, BigDecimal> expensesByPaymentMethodMap = allExpenses.stream()
        .filter(tx -> tx.getPaymentMethod() != null)
        .collect(Collectors.groupingBy(
            FinancialTransaction::getPaymentMethod,
            Collectors.reducing(BigDecimal.ZERO, FinancialTransaction::getAmount, BigDecimal::add)
        ));

    List<PaymentMethodExpenseDetail> expensesByPaymentMethod = expensesByPaymentMethodMap.entrySet().stream()
        .map(entry -> {
          double percentage = 0.0;
          if (totalExpensesAllTime.compareTo(BigDecimal.ZERO) > 0) {
            percentage = entry.getValue()
                .multiply(BigDecimal.valueOf(100))
                .divide(totalExpensesAllTime, 2, RoundingMode.HALF_UP)
                .doubleValue();
          }
          return new PaymentMethodExpenseDetail(entry.getKey(), entry.getValue(), percentage);
        })
        .sorted(Comparator.comparing(PaymentMethodExpenseDetail::amount).reversed())
        .toList();

    // 4. Evolução Mensal
    Map<String, List<FinancialTransaction>> transactionsByMonth = allTransactions.stream()
        .collect(Collectors.groupingBy(tx -> {
          LocalDate date = tx.getTransactionDate();
          return String.format("%d-%02d", date.getYear(), date.getMonthValue());
        }));

    List<MonthlyEvolutionDetail> monthlyEvolution = transactionsByMonth.entrySet().stream()
        .map(entry -> {
          String month = entry.getKey();
          List<FinancialTransaction> txList = entry.getValue();
          BigDecimal inc = sumByType(txList, CategoryType.INCOME);
          BigDecimal exp = sumByType(txList, CategoryType.EXPENSE);
          BigDecimal inv = sumByType(txList, CategoryType.INVESTMENT);
          BigDecimal sav = inc.subtract(exp).subtract(inv);
          return new MonthlyEvolutionDetail(month, inc, exp, inv, sav);
        })
        .sorted(Comparator.comparing(MonthlyEvolutionDetail::month))
        .toList();

    // 5. Insights
    List<String> insights = new ArrayList<>();

    // Insight 1: Variação de Despesas
    if (expenseComparison.percentage() != 0.0) {
      if (expenseComparison.percentage() > 0) {
        insights.add(String.format("Você gastou %.1f%% a mais que no mês passado.", expenseComparison.percentage()));
      } else {
        insights.add(String.format("Você gastou %.1f%% a menos que no mês passado.", Math.abs(expenseComparison.percentage())));
      }
    }

    // Insight 2: Variação de Investimentos
    BigDecimal investDiff = investmentComparison.difference();
    if (investDiff.compareTo(BigDecimal.ZERO) > 0) {
      insights.add(String.format("Você investiu R$ %.2f a mais que no mês anterior.", investDiff));
    } else if (investDiff.compareTo(BigDecimal.ZERO) < 0) {
      insights.add(String.format("Você investiu R$ %.2f a menos que no mês anterior.", investDiff.abs()));
    }

    // Insight 3: Representatividade de categoria de maior gasto
    if (!expensesByCategory.isEmpty()) {
      CategoryExpenseDetail topCategory = expensesByCategory.get(0);
      insights.add(String.format("%s representa %.1f%% dos seus gastos totais.", topCategory.category(), topCategory.percentage()));
    }

    // Insight 4: Maior gasto único (Despesa)
    Optional<FinancialTransaction> maxExpense = allExpenses.stream()
        .max(Comparator.comparing(FinancialTransaction::getAmount));
    if (maxExpense.isPresent()) {
      insights.add(String.format("Seu maior gasto único foi \"%s\" no valor de R$ %.2f.", 
          maxExpense.get().getDescription(), maxExpense.get().getAmount()));
    }

    // Insight 5: Volume de transações no mês atual
    insights.add(String.format("Você realizou %d transações neste mês.", currentMonthTx.size()));

    // Insight 6: Economia no mês atual
    if (currentMonthSaving.compareTo(BigDecimal.ZERO) > 0) {
      insights.add(String.format("Você economizou R$ %.2f neste mês.", currentMonthSaving));
    }

    // 6. Projeções
    int currentDay = now.getDayOfMonth();
    int totalDaysInMonth = now.lengthOfMonth();
    double paceMultiplier = (double) totalDaysInMonth / currentDay;

    BigDecimal currentMonthExpense = sumByType(currentMonthTx, CategoryType.EXPENSE);
    BigDecimal projectedExpense = currentMonthExpense.multiply(BigDecimal.valueOf(paceMultiplier)).setScale(2, RoundingMode.HALF_UP);

    BigDecimal currentMonthInvestment = sumByType(currentMonthTx, CategoryType.INVESTMENT);
    BigDecimal projectedInvestment = currentMonthInvestment.multiply(BigDecimal.valueOf(paceMultiplier)).setScale(2, RoundingMode.HALF_UP);

    DashboardProjections projections = new DashboardProjections(projectedExpense, projectedInvestment);

    return new DashboardResponse(
        summary,
        comparisons,
        insights,
        expensesByCategory,
        expensesByPaymentMethod,
        monthlyEvolution,
        projections
    );
  }

  private BigDecimal sumByType(List<FinancialTransaction> list, CategoryType type) {
    return list.stream()
        .filter(tx -> tx.getCategory() != null && tx.getCategory().getType() == type)
        .map(FinancialTransaction::getAmount)
        .reduce(BigDecimal.ZERO, BigDecimal::add);
  }

  private ComparisonDetail calculateComparison(BigDecimal current, BigDecimal previous) {
    BigDecimal difference = current.subtract(previous);
    double percentage = 0.0;

    if (previous.compareTo(BigDecimal.ZERO) > 0) {
      percentage = difference
          .multiply(BigDecimal.valueOf(100))
          .divide(previous, 2, RoundingMode.HALF_UP)
          .doubleValue();
    } else if (current.compareTo(BigDecimal.ZERO) > 0) {
      percentage = 100.0; // 100% aumento do zero
    }

    return new ComparisonDetail(current, previous, difference, percentage);
  }
}
