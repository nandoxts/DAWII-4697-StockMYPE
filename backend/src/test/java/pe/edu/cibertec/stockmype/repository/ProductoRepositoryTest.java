package pe.edu.cibertec.stockmype.repository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import pe.edu.cibertec.stockmype.entity.Producto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Pruebas de la capa de datos contra MySQL.
 * Cada test corre en una transacción con rollback al final: no ensucia la BD.
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ProductoRepositoryTest {

    @Autowired
    private ProductoRepository productoRepository;

    private Producto nuevoProducto(String codigo) {
        return Producto.builder()
                .codigo(codigo)
                .nombre("Producto de prueba " + codigo)
                .descripcion("Creado desde test")
                .categoria("Pruebas")
                .precio(new BigDecimal("10.50"))
                .stock(15)
                .build();
    }

    @Test
    @DisplayName("Insertar: guarda un producto y le asigna ID")
    void testInsertar() {
        Producto guardado = productoRepository.save(nuevoProducto("TEST-INS"));

        assertNotNull(guardado.getId());
        Optional<Producto> encontrado = productoRepository.findById(guardado.getId());
        assertTrue(encontrado.isPresent());
        assertEquals("TEST-INS", encontrado.get().getCodigo());
        assertNotNull(encontrado.get().getFechaRegistro());
    }

    @Test
    @DisplayName("Actualizar: modifica precio y stock de un producto")
    void testActualizar() {
        Producto guardado = productoRepository.save(nuevoProducto("TEST-UPD"));

        guardado.setPrecio(new BigDecimal("12.90"));
        guardado.setStock(50);
        productoRepository.saveAndFlush(guardado);

        Producto actualizado = productoRepository.findById(guardado.getId()).orElseThrow();
        assertEquals(0, new BigDecimal("12.90").compareTo(actualizado.getPrecio()));
        assertEquals(50, actualizado.getStock());
    }

    @Test
    @DisplayName("Eliminar: borra un producto por ID")
    void testEliminar() {
        Producto guardado = productoRepository.save(nuevoProducto("TEST-DEL"));
        Long id = guardado.getId();

        productoRepository.deleteById(id);
        productoRepository.flush();

        assertFalse(productoRepository.findById(id).isPresent());
    }

    @Test
    @DisplayName("Listar: devuelve todos los productos registrados")
    void testListar() {
        long antes = productoRepository.count();

        productoRepository.save(nuevoProducto("TEST-LS1"));
        productoRepository.save(nuevoProducto("TEST-LS2"));

        List<Producto> productos = productoRepository.findAll();
        assertEquals(antes + 2, productos.size());
        assertTrue(productos.stream().anyMatch(p -> p.getCodigo().equals("TEST-LS1")));
        assertTrue(productos.stream().anyMatch(p -> p.getCodigo().equals("TEST-LS2")));
    }
}
