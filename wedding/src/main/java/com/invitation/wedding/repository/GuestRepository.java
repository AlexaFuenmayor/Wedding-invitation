package com.invitation.wedding.repository;

import com.invitation.wedding.model.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface GuestRepository extends JpaRepository<Guest, Long> {
    Optional<Guest> findByCodigoAcceso(String codigoAcceso);



    // Invitados que confirmaron asistencia
   // List<Guest> findByAsistenciaConfirmadaTrue();

    // Invitados que NO confirmaron asistencia
   // List<Guest> findByAsistenciaConfirmadaFalse();
}




