package com.invitation.wedding.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Guest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String familia;
    private Integer maxAsistentes;
    private Integer asistentesConfirmados;

    @Column(columnDefinition = "TEXT")
    private String mensaje;

    private String telefono;

    @Enumerated(EnumType.STRING)
    private EstadoConfirmacion estadoConfirmacion = EstadoConfirmacion.PENDIENTE;

    @Column(unique = true)
    private String codigoAcceso;

    public Guest() {}
}
