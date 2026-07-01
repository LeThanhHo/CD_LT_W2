package com.example.bike_shop.config;

import com.example.bike_shop.entity.*;
import com.example.bike_shop.entity.enums.ProductStatus;
import com.example.bike_shop.entity.enums.RoleName;
import com.example.bike_shop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Seeds the database with sample data on first run:
 * - 1 admin, 2 customers
 * - 5 categories
 * - several brands
 * - 10 products
 *
 * Login credentials (created here):
 *   admin    / admin123   (ADMIN)
 *   customer1/ 123456     (CUSTOMER)
 *   customer2/ 123456     (CUSTOMER)
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // already seeded
        }

        // Users
        userRepository.save(User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .fullname("Quản trị viên")
                .email("admin@bikeshop.vn")
                .phone("0900000000")
                .address("123 Nguyễn Huệ, Quận 1, TP.HCM")
                .role(RoleName.ADMIN)
                .enabled(true)
                .build());

        userRepository.save(User.builder()
                .username("customer1")
                .password(passwordEncoder.encode("123456"))
                .fullname("Nguyễn Văn A")
                .email("customer1@gmail.com")
                .phone("0911111111")
                .address("45 Lê Lợi, Quận 1, TP.HCM")
                .role(RoleName.CUSTOMER)
                .enabled(true)
                .build());

        userRepository.save(User.builder()
                .username("customer2")
                .password(passwordEncoder.encode("123456"))
                .fullname("Trần Thị B")
                .email("customer2@gmail.com")
                .phone("0922222222")
                .address("78 Hai Bà Trưng, Quận 3, TP.HCM")
                .role(RoleName.CUSTOMER)
                .enabled(true)
                .build());

        // Categories
        Category roadBike = categoryRepository.save(Category.builder().name("Xe đạp đua").description("Xe đạp thể thao dùng để đua tốc độ").build());
        Category mtb = categoryRepository.save(Category.builder().name("Xe đạp địa hình").description("Xe đạp leo núi, off-road").build());
        Category touring = categoryRepository.save(Category.builder().name("Xe đạp touring").description("Xe đạp du lịch đường dài").build());
        Category kids = categoryRepository.save(Category.builder().name("Xe đạp trẻ em").description("Xe đạp dành cho trẻ em").build());
        Category electric = categoryRepository.save(Category.builder().name("Xe đạp điện").description("Xe đạp trợ lực điện").build());

        // Brands
        Brand giant = brandRepository.save(Brand.builder().name("Giant").logo("/images/brands/giant.png").build());
        Brand trek = brandRepository.save(Brand.builder().name("Trek").logo("/images/brands/trek.png").build());
        Brand specialized = brandRepository.save(Brand.builder().name("Specialized").logo("/images/brands/specialized.png").build());
        Brand cannondale = brandRepository.save(Brand.builder().name("Cannondale").logo("/images/brands/cannondale.png").build());
        Brand merida = brandRepository.save(Brand.builder().name("Merida").logo("/images/brands/merida.png").build());

        // Products
        productRepository.save(Product.builder()
                .name("Giant TCR Advanced Pro")
                .description("Xe đạp đua khung carbon, trọng lượng nhẹ, tối ưu cho tốc độ cao.")
                .price(new BigDecimal("45000000"))
                .quantity(10)
                .image("/images/products/tcr-advanced.jpg")
                .category(roadBike).brand(giant)
                .status(ProductStatus.AVAILABLE)
                .build());

        productRepository.save(Product.builder()
                .name("Trek Domane SL6")
                .description("Xe đạp đua endurance, êm ái cho hành trình dài.")
                .price(new BigDecimal("52000000"))
                .quantity(8)
                .image("/images/products/domane-sl6.jpg")
                .category(roadBike).brand(trek)
                .status(ProductStatus.AVAILABLE)
                .build());

        productRepository.save(Product.builder()
                .name("Specialized Stumpjumper")
                .description("Xe đạp địa hình full-suspension, chinh phục mọi cung đường off-road.")
                .price(new BigDecimal("68000000"))
                .quantity(5)
                .image("/images/products/stumpjumper.jpg")
                .category(mtb).brand(specialized)
                .status(ProductStatus.AVAILABLE)
                .build());

        productRepository.save(Product.builder()
                .name("Cannondale Trail 5")
                .description("Xe đạp địa hình giá tốt, phù hợp người mới bắt đầu.")
                .price(new BigDecimal("15000000"))
                .quantity(20)
                .image("/images/products/trail-5.jpg")
                .category(mtb).brand(cannondale)
                .status(ProductStatus.AVAILABLE)
                .build());

        productRepository.save(Product.builder()
                .name("Merida Big Nine")
                .description("Xe đạp địa hình bánh 29 inch, khung nhôm bền bỉ.")
                .price(new BigDecimal("12500000"))
                .quantity(15)
                .image("/images/products/big-nine.jpg")
                .category(mtb).brand(merida)
                .status(ProductStatus.AVAILABLE)
                .build());

        productRepository.save(Product.builder()
                .name("Giant ToughRoad SLR")
                .description("Xe đạp touring đa dụng, chở được hành lý đường dài.")
                .price(new BigDecimal("18500000"))
                .quantity(12)
                .image("/images/products/toughroad-slr.jpg")
                .category(touring).brand(giant)
                .status(ProductStatus.AVAILABLE)
                .build());

        productRepository.save(Product.builder()
                .name("Trek 520 Touring")
                .description("Xe đạp touring cổ điển, khung thép chắc chắn.")
                .price(new BigDecimal("22000000"))
                .quantity(7)
                .image("/images/products/trek-520.jpg")
                .category(touring).brand(trek)
                .status(ProductStatus.AVAILABLE)
                .build());

        productRepository.save(Product.builder()
                .name("Giant Animator C/B 16")
                .description("Xe đạp trẻ em bánh 16 inch, an toàn và nhiều màu sắc.")
                .price(new BigDecimal("3200000"))
                .quantity(25)
                .image("/images/products/animator-16.jpg")
                .category(kids).brand(giant)
                .status(ProductStatus.AVAILABLE)
                .build());

        productRepository.save(Product.builder()
                .name("Merida Kids 20")
                .description("Xe đạp trẻ em bánh 20 inch, khung nhôm nhẹ.")
                .price(new BigDecimal("4100000"))
                .quantity(18)
                .image("/images/products/kids-20.jpg")
                .category(kids).brand(merida)
                .status(ProductStatus.AVAILABLE)
                .build());

        productRepository.save(Product.builder()
                .name("Giant Momentum E+")
                .description("Xe đạp điện trợ lực, pin 500Wh, quãng đường 80km/lần sạc.")
                .price(new BigDecimal("35000000"))
                .quantity(6)
                .image("/images/products/momentum-e-plus.jpg")
                .category(electric).brand(giant)
                .status(ProductStatus.AVAILABLE)
                .build());

        System.out.println("=== DataInitializer: đã seed dữ liệu mẫu thành công ===");
        System.out.println("Tài khoản admin: admin / admin123");
        System.out.println("Tài khoản khách hàng: customer1 / 123456, customer2 / 123456");
    }
}
