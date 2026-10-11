package pe.edu.cibertec.stockmype.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import pe.edu.cibertec.stockmype.entity.Producto;
import pe.edu.cibertec.stockmype.entity.Usuario;
import pe.edu.cibertec.stockmype.repository.ProductoRepository;
import pe.edu.cibertec.stockmype.repository.UsuarioRepository;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!usuarioRepository.existsByUsername("admin")) {
            usuarioRepository.save(Usuario.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123")) // BCrypt
                    .nombre("Administrador StockMYPE")
                    .rol("ADMIN")
                    .build());
            log.info(">> Usuario de prueba creado: admin / admin123");
        }

        if (productoRepository.count() == 0) {
            productoRepository.saveAll(List.of(
                    producto("ABR-001", "Arroz extra 5 kg", "Bolsa de arroz extra", "Abarrotes", "24.90", 30),
                    producto("ABR-002", "Aceite vegetal 1 L", "Botella de aceite vegetal", "Abarrotes", "9.50", 25),
                    producto("ABR-003", "Azúcar rubia 1 kg", "Bolsa de azúcar rubia", "Abarrotes", "4.20", 40),
                    producto("LAC-001", "Leche evaporada 400 g", "Lata de leche evaporada", "Lácteos", "4.30", 60),
                    producto("BEB-001", "Gaseosa 1.5 L", "Botella de gaseosa", "Bebidas", "7.00", 4)
            ));
            log.info(">> Productos de prueba creados");
        }
    }

    private Producto producto(String codigo, String nombre, String desc, String cat, String precio, int stock) {
        return Producto.builder()
                .codigo(codigo)
                .nombre(nombre)
                .descripcion(desc)
                .categoria(cat)
                .precio(new BigDecimal(precio))
                .stock(stock)
                .build();
    }
}
