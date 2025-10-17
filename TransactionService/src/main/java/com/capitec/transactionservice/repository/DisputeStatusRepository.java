package com.capitec.transactionservice.repository;

import com.capitec.transactionservice.model.DisputeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DisputeStatusRepository extends JpaRepository<DisputeStatus, String> {}
