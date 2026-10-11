package pe.edu.cibertec.stockmype.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.cibertec.stockmype.dto.LoginRequest;
import pe.edu.cibertec.stockmype.dto.LoginResponse;
import pe.edu.cibertec.stockmype.entity.Usuario;
import pe.edu.cibertec.stockmype.exception.CredencialesInvalidasException;
import pe.edu.cibertec.stockmype.repository.UsuarioRepository;
import pe.edu.cibertec.stockmype.service.AuthService;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final String MSG_CREDENCIALES = "Usuario o contraseña incorrectos";

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByUsername(request.username())
                .orElseThrow(() -> new CredencialesInvalidasException(MSG_CREDENCIALES));

        if (!passwordEncoder.matches(request.password(), usuario.getPassword())) {
            throw new CredencialesInvalidasException(MSG_CREDENCIALES);
        }

        return new LoginResponse(
                usuario.getUsername(),
                usuario.getNombre(),
                usuario.getRol(),
                "Login exitoso");
    }
}
