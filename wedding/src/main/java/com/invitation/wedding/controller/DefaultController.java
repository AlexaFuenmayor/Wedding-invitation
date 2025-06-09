package com.invitation.wedding.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DefaultController {
    @GetMapping("/")
    public String index() {
        return "API de Invitaciones funcionando correctamente. Visita /api/guests";
    }
}
