package com.capitec.transactionservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dispute_reason_lookup", schema = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DisputeReason {
    @Id
    @Column(length = 50)
    private String code;

    @Column(nullable = false)
    private String description;
}

