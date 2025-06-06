package com.invitation.wedding.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class GuestLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String familyName;

    private Integer allowedAttendees;

    @Column(unique = true)
    private String code;

    private Boolean used = false;

    // Constructors
    public GuestLink() {}

    public GuestLink(String familyName, Integer allowedAttendees, String code) {
        this.familyName = familyName;
        this.allowedAttendees = allowedAttendees;
        this.code = code;
        this.used = false;
    }
}
