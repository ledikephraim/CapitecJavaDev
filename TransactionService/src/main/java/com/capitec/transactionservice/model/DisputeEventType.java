package com.capitec.transactionservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dispute_event_type_lookup", schema = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DisputeEventType {
    @Id
    @Column(length = 50)
    private String code;

    @Column(nullable = false)
    private String description;
}

