package com.capitec.transactionservice.service;

import com.capitec.transactionservice.model.*;
import com.capitec.transactionservice.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TransactionDisputeService {

    private final DisputeRepository disputeRepository;
    private final DisputeEventRepository disputeEventRepository;
    private final DisputeReasonRepository disputeReasonRepository;
    private final DisputeStatusRepository disputeStatusRepository;
    private final DisputeEventTypeRepository disputeEventTypeRepository;
    private final TransactionRepository transactionRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final String TOPIC_DISPUTE_CREATED = "bank.disputes.created";
    private static final String TOPIC_DISPUTE_UPDATED = "bank.disputes.updated";

    /**
     * Create a new dispute and emit a Kafka event.
     */
    @Transactional
    public Dispute createDispute(UUID transactionId, UUID userId, String reasonCode) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));

        DisputeReason reason = disputeReasonRepository.findById(reasonCode)
                .orElseThrow(() -> new IllegalArgumentException("Invalid dispute reason: " + reasonCode));

        DisputeStatus status = disputeStatusRepository.findById("PENDING")
                .orElseThrow(() -> new IllegalStateException("Missing default status PENDING"));

        Dispute dispute = Dispute.builder()
                .transaction(transaction)
                .userId(userId)
                .reason(reason)
                .status(status)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Dispute saved = disputeRepository.save(dispute);

        // Create event record
//        createEvent(saved, "CREATED", Map.of(
//                "reason", reasonCode,
//                "status", status.getCode()
//        ));

        // Emit Kafka event
//        kafkaTemplate.send(TOPIC_DISPUTE_CREATED, saved);

        return saved;
    }

    /**
     * Update dispute status (e.g., from PENDING → IN_REVIEW → RESOLVED)
     */
    @Transactional
    public Dispute updateDisputeStatus(UUID disputeId, String newStatusCode) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new IllegalArgumentException("Dispute not found"));

        DisputeStatus newStatus = disputeStatusRepository.findById(newStatusCode)
                .orElseThrow(() -> new IllegalArgumentException("Invalid status: " + newStatusCode));

        dispute.setStatus(newStatus);
        dispute.setUpdatedAt(LocalDateTime.now());

        Dispute updated = disputeRepository.save(dispute);

//        createEvent(updated, "UPDATED", Map.of(
//                "new_status", newStatusCode
//        ));

//        kafkaTemplate.send(TOPIC_DISPUTE_UPDATED, updated);

        return updated;
    }

    /**
     * Get all disputes for a specific user.
     */
    public List<Dispute> getDisputesByUser(UUID userId) {
        return disputeRepository.findByUserId(userId);
    }

    /**
     * Internal method to write an event record.
     */
//    private void createEvent(Dispute dispute, String eventTypeCode, Map<String, Object> eventData) {
//        DisputeEventType eventType = disputeEventTypeRepository.findById(eventTypeCode)
//                .orElseThrow(() -> new IllegalArgumentException("Invalid event type: " + eventTypeCode));
//
//        DisputeEvent event = DisputeEvent.builder()
//                .dispute(dispute)
//                .eventType(eventType)
//                .eventData(eventData) // Map works directly now
//                .createdAt(LocalDateTime.now())
//                .build();
//
//        disputeEventRepository.save(event);
//    }

}

