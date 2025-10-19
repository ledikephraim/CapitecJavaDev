// DisputeEventType.java
package com.capitec.transactionservice.model;

import jakarta.persistence .*;
import lombok .*;

@Entity
@Table(name = "dispute_event_type_lookup")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DisputeEventType {

    @Id
    @Column(name = "code", length = 50)
    private String code;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;
}