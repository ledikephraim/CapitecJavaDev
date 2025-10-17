package com.capitec.transactionservice.service;

import com.capitec.transactionservice.model.Transaction;
import com.capitec.transactionservice.model.TransactionType;
import com.capitec.transactionservice.repository.TransactionRepository;
import com.capitec.transactionservice.repository.TransactionTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.concurrent.ThreadLocalRandom;
@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionTypeRepository transactionTypeRepository;
    private final Random random = new Random();

    /**
     * Generate a random transaction for a given user
     */
    public Transaction generateTransaction(UUID userId) {
        List<TransactionType> types = transactionTypeRepository.findAll();
        if (types.isEmpty()) {
            throw new IllegalStateException("No transaction types defined in the database");
        }
        TransactionType randomType = types.get(random.nextInt(types.size()));

        BigDecimal amount = BigDecimal.valueOf(10 + (1000 - 10) * random.nextDouble())
                .setScale(2, BigDecimal.ROUND_HALF_UP);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = now.minusDays(30);
        long startEpoch = start.toEpochSecond(java.time.ZoneOffset.UTC);
        long endEpoch = now.toEpochSecond(java.time.ZoneOffset.UTC);
        long randomEpoch = ThreadLocalRandom.current().nextLong(startEpoch, endEpoch);
        LocalDateTime randomCreatedAt = LocalDateTime.ofEpochSecond(randomEpoch, 0, java.time.ZoneOffset.UTC);

        Transaction tx = Transaction.builder()
                .userId(userId)
                .transactionType(randomType)
                .amount(amount)
                .currency("ZAR")
                .createdAt(randomCreatedAt)
                .build();

        return transactionRepository.save(tx);
    }

    /**
     * Retrieve all transactions for a specific user
     */
    public List<Transaction> getTransactionsByUser(UUID userId) {
        return transactionRepository.findByUserId(userId);
    }
}
