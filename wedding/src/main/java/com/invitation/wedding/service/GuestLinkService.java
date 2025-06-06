package com.invitation.wedding.service;

import com.invitation.wedding.model.GuestLink;
import com.invitation.wedding.repository.GuestLinkRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GuestLinkService {

    private final GuestLinkRepository repository;

    public GuestLinkService(GuestLinkRepository repository) {
        this.repository = repository;
    }

    public Optional<GuestLink> getByCode(String code) {
        return repository.findByCode(code);
    }

    public void markAsUsed(GuestLink link) {
        link.setUsed(true);
        repository.save(link);
    }
}
