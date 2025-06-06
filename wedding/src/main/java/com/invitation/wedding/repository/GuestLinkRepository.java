package com.invitation.wedding.repository;

import com.invitation.wedding.model.GuestLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GuestLinkRepository extends JpaRepository<GuestLink, Long> {
    Optional<GuestLink> findByCode(String code);
}