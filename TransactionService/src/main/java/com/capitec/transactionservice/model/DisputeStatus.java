package com.capitec.transactionservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dispute_status_lookup", schema = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DisputeStatus {
    @Id
    @Column(length = 20)
    private String code;

    @Column(nullable = false)
    private String description;
}

