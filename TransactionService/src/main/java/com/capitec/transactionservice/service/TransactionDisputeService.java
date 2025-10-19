package com.capitec.transactionservice.service;

import com.capitec.transactionservice.model.*;
import com.capitec.transactionservice.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
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
        log.info("Creating dispute for transaction: {}, user: {}", transactionId, userId);

        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found: " + transactionId));

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
        log.info("Dispute created with ID: {}", saved.getId());

        Map<String, Object> eventData = new HashMap<>();
        eventData.put("reason", reasonCode);
        eventData.put("status", status.getCode());
        eventData.put("transactionId", transactionId.toString());
        eventData.put("userId", userId.toString());

        createEvent(saved, "CREATED", eventData);

        publishKafkaEvent(TOPIC_DISPUTE_CREATED, saved);

        return saved;
    }

    /**
     * Update dispute status (e.g., from PENDING → UNDER_REVIEW → RESOLVED)
     */
    @Transactional
    public Dispute updateDisputeStatus(UUID disputeId, String newStatusCode) {
        log.info("Updating dispute {} to status: {}", disputeId, newStatusCode);

        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new IllegalArgumentException("Dispute not found: " + disputeId));

        DisputeStatus oldStatus = dispute.getStatus();
        DisputeStatus newStatus = disputeStatusRepository.findById(newStatusCode)
                .orElseThrow(() -> new IllegalArgumentException("Invalid status: " + newStatusCode));

        dispute.setStatus(newStatus);
        dispute.setUpdatedAt(LocalDateTime.now());

        Dispute updated = disputeRepository.save(dispute);
        log.info("Dispute {} status updated from {} to {}",
                disputeId, oldStatus.getCode(), newStatusCode);

        Map<String, Object> eventData = new HashMap<>();
        eventData.put("oldStatus", oldStatus.getCode());
        eventData.put("newStatus", newStatusCode);
        eventData.put("updatedAt", LocalDateTime.now().toString());

        createEvent(updated, "STATUS_UPDATED", eventData);

        publishKafkaEvent(TOPIC_DISPUTE_UPDATED, updated);

        return updated;
    }

    /**
     * Get all disputes for a specific user.
     */
    public List<Dispute> getDisputesByUser(UUID userId) {
        log.debug("Fetching disputes for user: {}", userId);
        return disputeRepository.findByUserId(userId);
    }

    /**
     * Get dispute by ID
     */
    public Optional<Dispute> getDisputeById(UUID disputeId) {
        return disputeRepository.findById(disputeId);
    }

    /**
     * Internal method to write an event record.
     */
    private void createEvent(Dispute dispute, String eventTypeCode, Map<String, Object> eventData) {
        DisputeEventType eventType = disputeEventTypeRepository.findById(eventTypeCode)
                .orElseThrow(() -> new IllegalArgumentException("Invalid event type: " + eventTypeCode));

        DisputeEvent event = DisputeEvent.builder()
                .dispute(dispute)
                .eventType(eventType)
                .eventData(eventData)
                .createdAt(LocalDateTime.now())
                .build();

        disputeEventRepository.save(event);
        log.debug("Event {} recorded for dispute {}", eventTypeCode, dispute.getId());
    }

    /**
     * Publish event to Kafka with proper error handling
     */
    private void publishKafkaEvent(String topic, Dispute dispute) {
        kafkaTemplate.send(topic, dispute)
                .whenComplete((result, ex) -> {
                    if (ex == null) {
                        log.info("Kafka message sent successfully to topic: {}, partition: {}, offset: {}",
                                result.getRecordMetadata().topic(),
                                result.getRecordMetadata().partition(),
                                result.getRecordMetadata().offset());
                    } else {
                        log.error("Failed to send Kafka message to topic: {}", topic, ex);
                    }
                });
    }
}