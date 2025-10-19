package com.capitec.transactionservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dispute_reason_lookup")  // ✅ No schema attribute
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DisputeReason {

    @Id
    @Column(name = "code", length = 50)
    private String code;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;
}