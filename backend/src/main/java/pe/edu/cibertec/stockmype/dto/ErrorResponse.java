package pe.edu.cibertec.stockmype.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        LocalDateTime timestamp,
        int status,
        String error,
        String mensaje,
        Map<String, String> errores
) {
    public static ErrorResponse of(int status, String error, String mensaje, Map<String, String> errores) {
        return new ErrorResponse(LocalDateTime.now(), status, error, mensaje, errores);
    }
}
