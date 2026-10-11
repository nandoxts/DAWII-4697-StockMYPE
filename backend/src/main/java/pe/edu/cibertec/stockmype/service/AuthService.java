package pe.edu.cibertec.stockmype.service;

import pe.edu.cibertec.stockmype.dto.LoginRequest;
import pe.edu.cibertec.stockmype.dto.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);
}
