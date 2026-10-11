package pe.edu.cibertec.stockmype.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record ProductoRequest(

        @NotBlank(message = "El código es obligatorio")
        @Size(max = 20, message = "El código no debe superar 20 caracteres")
        String codigo,

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre no debe superar 100 caracteres")
        String nombre,

        @Size(max = 255, message = "La descripción no debe superar 255 caracteres")
        String descripcion,

        @NotBlank(message = "La categoría es obligatoria")
        @Size(max = 50, message = "La categoría no debe superar 50 caracteres")
        String categoria,

        @NotNull(message = "El precio es obligatorio")
        @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
        @Digits(integer = 8, fraction = 2, message = "El precio debe tener máximo 2 decimales")
        BigDecimal precio,

        @NotNull(message = "El stock es obligatorio")
        @Min(value = 0, message = "El stock no puede ser negativo")
        Integer stock
) {
}
