package com.invitation.wedding.dto;

public class ConfirmacionRequest {

    private Boolean asistira;
    private Integer asistentesConfirmados;
    private String mensaje;
    private String telefono;

    public Boolean getAsistira() { return asistira; }
    public void setAsistira(Boolean asistira) { this.asistira = asistira; }

    public Integer getAsistentesConfirmados() { return asistentesConfirmados; }
    public void setAsistentesConfirmados(Integer asistentesConfirmados) { this.asistentesConfirmados = asistentesConfirmados; }

    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
}
