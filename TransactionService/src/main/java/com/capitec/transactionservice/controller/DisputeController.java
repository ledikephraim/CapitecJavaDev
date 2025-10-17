package com.capitec.transactionservice.controller;

import com.capitec.transactionservice.model.Dispute;
import com.capitec.transactionservice.service.TransactionDisputeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/disputes")
@RequiredArgsConstructor
public class DisputeController {

    private final TransactionDisputeService disputeService;

    /**
     * Create a new dispute for a transaction.
     *
     * @param request { "transactionId": "...", "reasonCode": "INCORRECT_AMOUNT" }
     */
    @PostMapping
    public ResponseEntity<?> createDispute(@RequestBody CreateDisputeRequest request,
                                           Authentication authentication) {
        try {
            UUID userId = extractUserId(authentication);
            Dispute dispute = disputeService.createDispute(request.transactionId(), userId, request.reasonCode());
            return ResponseEntity.ok(dispute);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    /**
     * Update an existing dispute's status.
     *
     * @param disputeId the dispute UUID
     * @param request   { "statusCode": "RESOLVED" }
     */
    @PutMapping("/{disputeId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable UUID disputeId,
                                          @RequestBody UpdateDisputeStatusRequest request) {
        try {
            Dispute updated = disputeService.updateDisputeStatus(disputeId, request.statusCode());
            return ResponseEntity.ok(updated);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    /**
     * Get all disputes for the logged-in user.
     */
    @GetMapping
    public ResponseEntity<List<Dispute>> getUserDisputes(Authentication authentication) {

            UUID userId = extractUserId(authentication);
            List<Dispute> disputes = disputeService.getDisputesByUser(userId);
            return ResponseEntity.ok(disputes);
    }

    private UUID extractUserId(Authentication authentication) {
        try {
            Map<String, Object> claims = (Map<String, Object>) authentication.getCredentials();
            String userIdStr = (String) claims.get("userId");
            return UUID.fromString(userIdStr);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("User ID is not a valid UUID in principal: " + authentication.getName());
        }
    }

    public record CreateDisputeRequest(UUID transactionId, String reasonCode) {}
    public record UpdateDisputeStatusRequest(String statusCode) {}
}

