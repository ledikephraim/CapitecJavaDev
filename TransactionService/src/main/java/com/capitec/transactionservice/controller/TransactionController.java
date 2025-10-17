package com.capitec.transactionservice.controller;


import com.capitec.transactionservice.model.Transaction;
import com.capitec.transactionservice.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    /**
     * Generate a random transaction for the authenticated user
     */
    @PostMapping("/generate")
    public ResponseEntity<Transaction> generateTransaction(Authentication authentication) {
        Map<String, Object> claims = (Map<String, Object>) authentication.getCredentials();

        String userIdStr = (String) claims.get("userId");
        UUID userId = UUID.fromString(userIdStr);

        Transaction tx = transactionService.generateTransaction(userId);
        return ResponseEntity.ok(tx);
    }

    /**
     * Get all transactions for the authenticated user
     */
    @GetMapping
    public ResponseEntity<List<Transaction>> getTransactions(Authentication authentication) {
        @SuppressWarnings("unchecked")
        Map<String, Object> claims = (Map<String, Object>) authentication.getCredentials();

        String userIdStr = (String) claims.get("userId");
        UUID userId = UUID.fromString(userIdStr);
        List<Transaction> transactions = transactionService.getTransactionsByUser(userId);
        return ResponseEntity.ok(transactions);
    }
}
