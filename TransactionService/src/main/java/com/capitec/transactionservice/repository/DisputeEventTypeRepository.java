package com.capitec.transactionservice.repository;

import com.capitec.transactionservice.model.DisputeEventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DisputeEventTypeRepository extends JpaRepository<DisputeEventType, String> {}








