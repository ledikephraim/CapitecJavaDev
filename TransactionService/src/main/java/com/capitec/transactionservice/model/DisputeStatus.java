package com.capitec.transactionservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dispute_status_lookup")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DisputeStatus {

    @Id
    @Column(name = "code", length = 20)
    private String code;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;
}