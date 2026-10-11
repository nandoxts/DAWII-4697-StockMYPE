package pe.edu.cibertec.stockmype.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.cibertec.stockmype.dto.LoginRequest;
import pe.edu.cibertec.stockmype.dto.LoginResponse;
import pe.edu.cibertec.stockmype.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // 200 OK | 400 datos inválidos | 401 credenciales incorrectas
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
