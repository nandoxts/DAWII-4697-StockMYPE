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

        // Catálogo de una bodega típica (50 productos). Solo inserta los códigos que aún no existen,
        // así no duplica ni pisa lo que el usuario ya modificó.
        List<Producto> faltantes = catalogoInicial().stream()
                .filter(p -> !productoRepository.existsByCodigo(p.getCodigo()))
                .toList();
        if (!faltantes.isEmpty()) {
            productoRepository.saveAll(faltantes);
            log.info(">> {} productos de ejemplo creados", faltantes.size());
        }
    }

    private List<Producto> catalogoInicial() {
        return List.of(
                producto("ABR-001", "Arroz extra 5 kg", "Bolsa de arroz extra", "Abarrotes", "24.90", 30),
                producto("ABR-002", "Aceite vegetal 1 L", "Botella de aceite vegetal", "Abarrotes", "9.50", 25),
                producto("ABR-003", "Azúcar rubia 1 kg", "Bolsa de azúcar rubia", "Abarrotes", "4.20", 40),
                producto("ABR-004", "Fideos tallarín 500 g", "Paquete de fideos tallarín", "Abarrotes", "3.80", 45),
                producto("ABR-005", "Fideos canuto 250 g", "Paquete de fideos canuto", "Abarrotes", "1.90", 38),
                producto("ABR-006", "Lenteja 500 g", "Bolsa de lenteja", "Abarrotes", "5.20", 20),
                producto("ABR-007", "Frejol canario 500 g", "Bolsa de frejol canario", "Abarrotes", "6.90", 15),
                producto("ABR-008", "Sal de mesa 1 kg", "Bolsa de sal yodada", "Abarrotes", "1.60", 35),
                producto("ABR-009", "Avena 900 g", "Bolsa de hojuelas de avena", "Abarrotes", "6.50", 18),
                producto("ABR-010", "Harina sin preparar 1 kg", "Bolsa de harina de trigo", "Abarrotes", "4.60", 3),
                producto("ABR-011", "Atún en aceite 170 g", "Lata de atún en trozos", "Abarrotes", "5.90", 42),
                producto("ABR-012", "Sardina en salsa de tomate 425 g", "Lata de sardinas", "Abarrotes", "6.20", 0),
                producto("ABR-013", "Mayonesa 100 g", "Doypack de mayonesa", "Abarrotes", "2.80", 24),
                producto("ABR-014", "Café instantáneo 50 g", "Frasco de café", "Abarrotes", "8.90", 12),
                producto("ABR-015", "Chocolate de taza 90 g", "Tableta de chocolate para taza", "Abarrotes", "3.50", 16),
                producto("LAC-001", "Leche evaporada 400 g", "Lata de leche evaporada", "Lácteos", "4.30", 60),
                producto("LAC-002", "Leche evaporada light 400 g", "Lata de leche light", "Lácteos", "4.50", 22),
                producto("LAC-003", "Yogurt de fresa 1 L", "Botella de yogurt bebible", "Lácteos", "6.90", 10),
                producto("LAC-004", "Mantequilla 200 g", "Barra de mantequilla con sal", "Lácteos", "8.50", 6),
                producto("LAC-005", "Queso fresco 500 g", "Queso fresco por unidad", "Lácteos", "12.00", 4),
                producto("LAC-006", "Huevos x 15", "Bandeja de huevos rosados", "Lácteos", "9.90", 14),
                producto("BEB-001", "Gaseosa 1.5 L", "Botella de gaseosa", "Bebidas", "7.00", 4),
                producto("BEB-002", "Gaseosa 500 ml", "Botella personal de gaseosa", "Bebidas", "2.50", 48),
                producto("BEB-003", "Agua sin gas 625 ml", "Botella de agua mineral", "Bebidas", "1.50", 60),
                producto("BEB-004", "Agua sin gas 2.5 L", "Bidón de agua mineral", "Bebidas", "3.80", 20),
                producto("BEB-005", "Bebida rehidratante 500 ml", "Botella de bebida isotónica", "Bebidas", "2.80", 30),
                producto("BEB-006", "Jugo de durazno 1 L", "Caja de néctar de durazno", "Bebidas", "4.90", 18),
                producto("BEB-007", "Cerveza lata 355 ml", "Lata de cerveza", "Bebidas", "3.90", 72),
                producto("BEB-008", "Energizante 473 ml", "Lata de bebida energizante", "Bebidas", "4.50", 2),
                producto("SNK-001", "Papas fritas clásicas 40 g", "Bolsa de papas fritas", "Snacks", "2.00", 36),
                producto("SNK-002", "Galletas de soda x 6", "Paquete de galletas de soda", "Snacks", "2.30", 40),
                producto("SNK-003", "Galletas rellenas de vainilla", "Paquete de galletas rellenas", "Snacks", "1.20", 55),
                producto("SNK-004", "Chocolate con maní 28 g", "Barra de chocolate", "Snacks", "1.50", 44),
                producto("SNK-005", "Caramelos surtidos x 100", "Bolsa de caramelos", "Snacks", "5.50", 8),
                producto("SNK-006", "Chifles 50 g", "Bolsa de chifles salados", "Snacks", "2.50", 0),
                producto("SNK-007", "Maní salado 100 g", "Bolsa de maní tostado", "Snacks", "3.00", 21),
                producto("LIM-001", "Detergente en polvo 800 g", "Bolsa de detergente", "Limpieza", "9.80", 17),
                producto("LIM-002", "Lavavajilla en pasta 500 g", "Pote de lavavajilla", "Limpieza", "4.90", 13),
                producto("LIM-003", "Lejía 1 L", "Botella de lejía tradicional", "Limpieza", "3.20", 25),
                producto("LIM-004", "Papel higiénico x 4", "Paquete de papel higiénico doble hoja", "Limpieza", "6.50", 30),
                producto("LIM-005", "Esponja lavavajilla x 2", "Paquete de esponjas", "Limpieza", "2.50", 5),
                producto("LIM-006", "Bolsas de basura x 10", "Rollo de bolsas negras", "Limpieza", "3.50", 19),
                producto("CUI-001", "Jabón de tocador 90 g", "Barra de jabón", "Cuidado personal", "2.20", 33),
                producto("CUI-002", "Shampoo 400 ml", "Frasco de shampoo", "Cuidado personal", "14.90", 9),
                producto("CUI-003", "Pasta dental 90 g", "Tubo de pasta dental", "Cuidado personal", "5.50", 26),
                producto("CUI-004", "Desodorante en barra 50 g", "Desodorante antitranspirante", "Cuidado personal", "11.90", 3),
                producto("CUI-005", "Toallas higiénicas x 10", "Paquete de toallas higiénicas", "Cuidado personal", "5.90", 14),
                producto("CUI-006", "Pañales talla G x 20", "Paquete de pañales", "Cuidado personal", "28.90", 7),
                producto("PAN-001", "Pan de molde blanco", "Bolsa de pan de molde", "Panadería", "7.50", 11),
                producto("PAN-002", "Keke de vainilla 500 g", "Keke envasado", "Panadería", "9.00", 1)
        );
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
