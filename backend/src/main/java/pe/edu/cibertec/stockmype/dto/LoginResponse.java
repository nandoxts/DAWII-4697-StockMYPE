package pe.edu.cibertec.stockmype.dto;

public record LoginResponse(
        String username,
        String nombre,
        String rol,
        String mensaje
) {
}
