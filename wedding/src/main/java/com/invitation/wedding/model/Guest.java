package com.invitation.wedding.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Guest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nombre o identificador de la familia
    private String familia;

    // Número máximo de personas invitadas (ya registrado)
    private Integer maxAsistentes;

    // Número de personas que confirmaron (llenado en el formulario)
    private Integer asistentesConfirmados;

    // Mensaje personalizado al confirmar
    private String mensaje;
    private String telefono;

    // Si confirmaron su asistencia o no
    private Boolean asistenciaConfirmada;

    // Código único para validar que solo esa familia acceda
    @Column(unique = true)
    private String codigoAcceso;

    public Guest() {}
}
