package com.capitec.transactionservice.repository;

import com.capitec.transactionservice.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface DisputeEventRepository extends JpaRepository<DisputeEvent, UUID> {}
