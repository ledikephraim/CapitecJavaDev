package com.capitec.transactionservice.repository;

import com.capitec.transactionservice.model.Transaction;
import com.capitec.transactionservice.model.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionTypeRepository extends JpaRepository<TransactionType, Integer> {
    TransactionType findByTypeName(String typeName);
}