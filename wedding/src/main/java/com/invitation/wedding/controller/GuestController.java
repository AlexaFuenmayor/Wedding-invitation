package com.invitation.wedding.controller;

import com.invitation.wedding.model.Guest;
import com.invitation.wedding.repository.GuestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/guests")
@CrossOrigin(origins = "http://localhost:5173") // O el puerto donde corre tu front
public class GuestController {

    @Autowired
    private GuestRepository guestRepository;

    // -----------------------------
    // ADMIN: Crear nuevo invitado
    // -----------------------------
    @PostMapping
    public ResponseEntity<?> crearInvitado(@RequestBody Guest nuevoGuest) {
        if (guestRepository.findByCodigoAcceso(nuevoGuest.getCodigoAcceso()).isPresent()) {
            return ResponseEntity.badRequest().body("El código ya existe.");
        }

        nuevoGuest.setAsistenciaConfirmada(false);
        nuevoGuest.setAsistentesConfirmados(0);

        Guest guardado = guestRepository.save(nuevoGuest);
        return ResponseEntity.status(201).body(guardado);
    }

    // -----------------------------
    // ADMIN: Ver invitado por ID
    // -----------------------------
    @GetMapping("/admin/{id}")
    public ResponseEntity<Object> getGuestById(@PathVariable Long id) {
        Optional<Guest> guestOpt = guestRepository.findById(id);
        if (guestOpt.isPresent()) {
            return ResponseEntity.ok(guestOpt.get());
        } else {
            return ResponseEntity.status(404).body("Invitado no encontrado.");
        }
    }

    // -----------------------------
    // ADMIN: Eliminar invitado por ID
    // -----------------------------
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> eliminarInvitado(@PathVariable Long id) {
        if (!guestRepository.existsById(id)) {
            return ResponseEntity.status(404).body("Invitado no encontrado.");
        }

        guestRepository.deleteById(id);
        return ResponseEntity.ok("Invitado eliminado exitosamente.");
    }

    // -----------------------------
    // ADMIN: Resetear estado por ID
    // -----------------------------
    @PutMapping("/admin/{id}/reset")
    public ResponseEntity<?> resetearInvitadoPorId(@PathVariable Long id) {
        Optional<Guest> optionalGuest = guestRepository.findById(id);
        if (optionalGuest.isEmpty()) {
            return ResponseEntity.status(404).body("Invitado no encontrado.");
        }

        Guest guest = optionalGuest.get();
        guest.setAsistenciaConfirmada(false);
        guest.setAsistentesConfirmados(0);
        guest.setMensaje(null);
        guest.setTelefono(null);

        guestRepository.save(guest);
        return ResponseEntity.ok("Registro reiniciado correctamente para ID: " + id);
    }

    // -----------------------------
    // ADMIN: Resetear estado por código
    // -----------------------------
    @PutMapping("/admin/codigo/{codigo}/reset")
    public ResponseEntity<?> resetearInvitadoPorCodigo(@PathVariable String codigo) {
        Optional<Guest> optionalGuest = guestRepository.findByCodigoAcceso(codigo);
        if (optionalGuest.isEmpty()) {
            return ResponseEntity.status(404).body("Código no válido");
        }

        Guest guest = optionalGuest.get();
        guest.setAsistenciaConfirmada(false);
        guest.setAsistentesConfirmados(0);
        guest.setMensaje(null);
        guest.setTelefono(null);

        guestRepository.save(guest);
        return ResponseEntity.ok("Registro reiniciado correctamente para código: " + codigo);
    }

    // -----------------------------
    // INVITADO: Buscar por código
    // -----------------------------
    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<?> getGuestByCodigo(@PathVariable String codigo) {
        Optional<Guest> guest = guestRepository.findByCodigoAcceso(codigo);

        if (guest.isPresent()) {
            return ResponseEntity.ok(guest.get());
        } else {
            return ResponseEntity.status(404).body("Código no válido");
        }
    }

    // -----------------------------
    // INVITADO: Confirmar asistencia por código
    // -----------------------------
    @PutMapping("/codigo/{codigo}/confirmar")
    public ResponseEntity<?> confirmarAsistencia(
            @PathVariable String codigo,
            @RequestBody Guest updatedGuest
    ) {
        Optional<Guest> optionalGuest = guestRepository.findByCodigoAcceso(codigo);

        if (optionalGuest.isEmpty()) {
            return ResponseEntity.status(404).body("Código no válido");
        }

        Guest guest = optionalGuest.get();

        if (Boolean.TRUE.equals(guest.getAsistenciaConfirmada())) {
            return ResponseEntity.status(400).body("Ya se ha confirmado la asistencia anteriormente.");
        }

        if (updatedGuest.getAsistentesConfirmados() > guest.getMaxAsistentes()) {
            return ResponseEntity.badRequest().body("Número de asistentes excede el máximo permitido.");
        }

        guest.setAsistenciaConfirmada(true);
        guest.setAsistentesConfirmados(updatedGuest.getAsistentesConfirmados());
        guest.setMensaje(updatedGuest.getMensaje());
        guest.setTelefono(updatedGuest.getTelefono());

        Guest confirmado = guestRepository.save(guest);
        return ResponseEntity.ok(confirmado);
    }
}
