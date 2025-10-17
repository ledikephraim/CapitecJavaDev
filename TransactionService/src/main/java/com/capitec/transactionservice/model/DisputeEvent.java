package com.capitec.transactionservice.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import org.hibernate.annotations.Type;
//import org.hibernate.annotations.TypeDef;

@Entity
@Table(name = "dispute_events", schema = "capitecbank.transactions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
//@TypeDef(name = "jsonb", typeClass = JsonBinaryType.class)
public class DisputeEvent {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "dispute_id", nullable = false)
    private Dispute dispute;

    @ManyToOne
    @JoinColumn(name = "event_type", nullable = false)
    private DisputeEventType eventType;

//    @Type(type = "jsonb") // <-- now works
//    @Column(name = "event_data", columnDefinition = "jsonb")
    @Column(name = "event_data", columnDefinition = "jsonb")
//    private Map<String, Object> eventData;
    private String eventData;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
