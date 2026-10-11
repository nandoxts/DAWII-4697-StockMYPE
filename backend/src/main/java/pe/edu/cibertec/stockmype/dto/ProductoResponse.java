package pe.edu.cibertec.stockmype.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductoResponse(
        Long id,
        String codigo,
        String nombre,
        String descripcion,
        String categoria,
        BigDecimal precio,
        Integer stock,
        LocalDateTime fechaRegistro
) {
}
