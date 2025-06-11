package com.invitation.wedding.controller;

import com.invitation.wedding.dto.ConfirmacionRequest;
import com.invitation.wedding.model.EstadoConfirmacion;
import com.invitation.wedding.model.Guest;
import com.invitation.wedding.repository.GuestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<String> crearInvitado(@RequestBody Guest nuevoGuest) {
        if (guestRepository.findByCodigoAcceso(nuevoGuest.getCodigoAcceso()).isPresent()) {
            return ResponseEntity.badRequest().body("El código ya existe.");
        }

        nuevoGuest.setEstadoConfirmacion(EstadoConfirmacion.PENDIENTE); // Inicializar estado
        nuevoGuest.setAsistentesConfirmados(0);
        Guest guardado = guestRepository.save(nuevoGuest);
        return ResponseEntity.status(201).body("Invitado creado con éxito: " + guardado.getId());
    }

    // -----------------------------
    // ADMIN: Ver invitado por ID
    // -----------------------------
    @GetMapping("/admin/{id}")
    public ResponseEntity<Guest> getGuestById(@PathVariable Long id) {
        return guestRepository.findById(id)
                .map(guest -> ResponseEntity.ok().body(guest))
                .orElse(ResponseEntity.notFound().build());
    }

    // -----------------------------
    // ADMIN: Eliminar invitado por ID
    // -----------------------------
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<String> eliminarInvitado(@PathVariable Long id) {
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
    public ResponseEntity<String> resetearInvitadoPorId(@PathVariable Long id) {
        return guestRepository.findById(id)
                .map(guest -> {
                    guest.setEstadoConfirmacion(EstadoConfirmacion.PENDIENTE); // Reiniciar estado
                    guest.setAsistentesConfirmados(0);
                    guest.setMensaje(null);
                    guest.setTelefono(null);
                    guestRepository.save(guest);
                    return ResponseEntity.ok("Registro reiniciado correctamente para ID: " + id);
                })
                .orElse(ResponseEntity.status(404).body("Invitado no encontrado."));
    }

    // -----------------------------
    // ADMIN: Resetear estado por código
    // -----------------------------
    @PutMapping("/admin/codigo/{codigo}/reset")
    public ResponseEntity<String> resetearInvitadoPorCodigo(@PathVariable String codigo) {
        return guestRepository.findByCodigoAcceso(codigo)
                .map(guest -> {
                    guest.setEstadoConfirmacion(EstadoConfirmacion.PENDIENTE); // Reiniciar estado
                    guest.setAsistentesConfirmados(0);
                    guest.setMensaje(null);
                    guest.setTelefono(null);
                    guestRepository.save(guest);
                    return ResponseEntity.ok("Registro reiniciado correctamente para código: " + codigo);
                })
                .orElse(ResponseEntity.status(404).body("Código no válido"));
    }

    // -----------------------------
    // INVITADO: Buscar por código
    // -----------------------------
    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<Guest> getGuestByCodigo(@PathVariable String codigo) {
        return guestRepository.findByCodigoAcceso(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // -----------------------------
    // INVITADO: Confirmar asistencia por código
    // -----------------------------
    @PutMapping("/codigo/{codigo}/confirmar")
    public ResponseEntity<?> confirmarAsistencia(
            @PathVariable String codigo,
            @RequestBody ConfirmacionRequest confirmacion
    ) {
        return guestRepository.findByCodigoAcceso(codigo)
                .map(guest -> {
                    if (guest.getEstadoConfirmacion() == EstadoConfirmacion.CONFIRMADO || guest.getEstadoConfirmacion() == EstadoConfirmacion.NEGADO) {
                        return ResponseEntity.status(400).body("Ya se ha registrado una respuesta anteriormente.");
                    }

                    boolean asistira = Boolean.TRUE.equals(confirmacion.getAsistira());

                    if (asistira && confirmacion.getAsistentesConfirmados() > guest.getMaxAsistentes()) {
                        return ResponseEntity.badRequest().body("Número de asistentes excede el máximo permitido.");
                    }

                    guest.setEstadoConfirmacion(asistira ? EstadoConfirmacion.CONFIRMADO : EstadoConfirmacion.NEGADO);
                    guest.setAsistentesConfirmados(asistira ? confirmacion.getAsistentesConfirmados() : 0);
                    guest.setMensaje(confirmacion.getMensaje());
                    guest.setTelefono(confirmacion.getTelefono());

                    Guest actualizado = guestRepository.save(guest);
                    return ResponseEntity.ok(actualizado);
                })
                .orElse(ResponseEntity.status(404).body("Código no válido"));
    }
}
