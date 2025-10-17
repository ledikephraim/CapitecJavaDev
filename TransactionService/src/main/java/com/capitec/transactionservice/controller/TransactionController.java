package com.capitec.transactionservice.controller;


import com.capitec.transactionservice.model.Transaction;
import com.capitec.transactionservice.service.TransactionService;
//import com.capitec.transactionservice.auth.service.JwtService; // Reuse the auth service's JWT utils
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Transaction> generateTransaction(Principal principal) {
        // Extract user ID from Principal or JWT
//        UUID userId = UUID.fromString(principal.getName());
        UUID userId = UUID.fromString("74978714-cbcd-4164-8f52-966249b3cb22");


        Transaction tx = transactionService.generateTransaction(userId);
        return ResponseEntity.ok(tx);
    }

    /**
     * Get all transactions for the authenticated user
     */
    @GetMapping
    public ResponseEntity<List<Transaction>> getTransactions(Principal principal) {
//        UUID userId = UUID.fromString(principal.getName());
        UUID userId = UUID.fromString("74978714-cbcd-4164-8f52-966249b3cb22");
        List<Transaction> transactions = transactionService.getTransactionsByUser(userId);
        return ResponseEntity.ok(transactions);
    }
}
