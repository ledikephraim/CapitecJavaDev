package com.capitec.transactionservice.repository;

import com.capitec.transactionservice.model.DisputeReason;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DisputeReasonRepository extends JpaRepository<DisputeReason, String> {}
