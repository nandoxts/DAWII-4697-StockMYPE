package pe.edu.cibertec.stockmype.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(

        @NotBlank(message = "El usuario es obligatorio")
        @Size(max = 50, message = "El usuario no debe superar 50 caracteres")
        String username,

        @NotBlank(message = "La contraseña es obligatoria")
        String password
) {
}
