package com.capitec.transactionservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "transaction_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "type_name", length = 50, unique = true, nullable = false)
    private String typeName;
}