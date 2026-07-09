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
    private final PostRepository postRepository;
    private final ContactRepository contactRepository;
    private final NotificationRepository notificationRepository;
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

        User customer1 = userRepository.save(User.builder()
                .username("customer1")
                .password(passwordEncoder.encode("123456"))
                .fullname("Nguyễn Văn A")
                .email("customer1@gmail.com")
                .phone("0911111111")
                .address("45 Lê Lợi, Quận 1, TP.HCM")
                .role(RoleName.CUSTOMER)
                .enabled(true)
                .build());

        User customer2 = userRepository.save(User.builder()
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

        // Posts (news/blog)
        postRepository.save(Post.builder()
                .title("5 kinh nghiệm chọn xe đạp đường trường cho người mới bắt đầu")
                .slug("5-kinh-nghiem-chon-xe-dap-duong-truong-cho-nguoi-moi-bat-dau")
                .thumbnail("/images/posts/road-bike-tips.jpg")
                .content("Xe đạp đường trường (road bike) đòi hỏi người dùng cân nhắc kỹ về khung xe, " +
                        "nhóm truyền động và kích cỡ phù hợp với vóc dáng. Bài viết này chia sẻ 5 kinh nghiệm " +
                        "quan trọng giúp bạn chọn được chiếc xe ưng ý: (1) xác định ngân sách, (2) đo size khung " +
                        "chuẩn xác, (3) ưu tiên nhóm gear phù hợp địa hình, (4) thử xe trước khi mua, " +
                        "(5) đừng quên phụ kiện an toàn đi kèm.")
                .author("Đội ngũ BikeShop")
                .status(com.example.bike_shop.entity.enums.PostStatus.PUBLISHED)
                .build());

        postRepository.save(Post.builder()
                .title("Xe đạp địa hình (MTB) và những điều cần biết trước khi xuống tiền")
                .slug("xe-dap-dia-hinh-mtb-va-nhung-dieu-can-biet-truoc-khi-xuong-tien")
                .thumbnail("/images/posts/mtb-guide.jpg")
                .content("MTB là dòng xe được thiết kế chuyên biệt để chinh phục địa hình gồ ghề, đường mòn, " +
                        "sỏi đá. Khi chọn mua, bạn nên chú ý đến hệ thống giảm xóc (fork suspension), " +
                        "chất liệu khung (nhôm hoặc carbon), và kích thước bánh xe (27.5 hay 29 inch) " +
                        "tùy theo chiều cao và phong cách đi xe của mình.")
                .author("Đội ngũ BikeShop")
                .status(com.example.bike_shop.entity.enums.PostStatus.PUBLISHED)
                .build());

        postRepository.save(Post.builder()
                .title("Xe đạp điện trợ lực: giải pháp di chuyển xanh cho đô thị")
                .slug("xe-dap-dien-tro-luc-giai-phap-di-chuyen-xanh-cho-do-thi")
                .thumbnail("/images/posts/e-bike-city.jpg")
                .content("Với động cơ trợ lực và pin dung lượng lớn, xe đạp điện giúp người dùng di chuyển " +
                        "xa hơn mà không tốn quá nhiều sức. Đây là lựa chọn lý tưởng cho việc đi làm, " +
                        "đi học hàng ngày tại các đô thị lớn, vừa tiết kiệm chi phí vừa thân thiện môi trường.")
                .author("Đội ngũ BikeShop")
                .status(com.example.bike_shop.entity.enums.PostStatus.PUBLISHED)
                .build());

        postRepository.save(Post.builder()
                .title("Hướng dẫn bảo dưỡng xe đạp định kỳ tại nhà")
                .slug("huong-dan-bao-duong-xe-dap-dinh-ky-tai-nha")
                .thumbnail("/images/posts/bike-maintenance.jpg")
                .content("Bảo dưỡng định kỳ giúp xe đạp của bạn luôn vận hành êm ái và bền bỉ. " +
                        "Một số việc bạn có thể tự làm tại nhà: vệ sinh và tra dầu xích, kiểm tra áp suất lốp, " +
                        "căn chỉnh phanh, và kiểm tra độ chặt của các ốc vít quan trọng mỗi 2-4 tuần.")
                .author("Đội ngũ BikeShop")
                .status(com.example.bike_shop.entity.enums.PostStatus.PUBLISHED)
                .build());

        postRepository.save(Post.builder()
                .title("Xe đạp trẻ em: chọn size nào là vừa vặn và an toàn nhất?")
                .slug("xe-dap-tre-em-chon-size-nao-la-vua-van-va-an-toan-nhat")
                .thumbnail("/images/posts/kids-bike-size.jpg")
                .content("Chọn xe đạp trẻ em không chỉ dựa vào độ tuổi mà quan trọng hơn là chiều cao của bé. " +
                        "Xe bánh 12-14 inch phù hợp bé 2-4 tuổi, 16-18 inch cho bé 4-6 tuổi, và 20 inch " +
                        "cho bé 6-9 tuổi. Luôn ưu tiên xe có phanh an toàn và khung nhẹ để bé dễ điều khiển.")
                .author("Đội ngũ BikeShop")
                .status(com.example.bike_shop.entity.enums.PostStatus.PUBLISHED)
                .build());

        // Contacts
        contactRepository.save(Contact.builder()
                .fullname("Lê Văn Hùng")
                .email("hung.le@gmail.com")
                .phone("0933333333")
                .message("Shop có hỗ trợ trả góp cho xe đạp điện không ạ?")
                .status(com.example.bike_shop.entity.enums.ContactStatus.PENDING)
                .build());

        contactRepository.save(Contact.builder()
                .fullname("Phạm Thị Mai")
                .email("mai.pham@gmail.com")
                .phone("0944444444")
                .message("Tôi muốn hỏi về chính sách bảo hành cho xe MTB Giant.")
                .status(com.example.bike_shop.entity.enums.ContactStatus.PROCESSED)
                .build());

        contactRepository.save(Contact.builder()
                .fullname("Trần Quốc Bảo")
                .email("bao.tran@gmail.com")
                .phone("0955555555")
                .message("Shop có giao hàng ra Hà Nội không và mất bao lâu ạ?")
                .status(com.example.bike_shop.entity.enums.ContactStatus.PENDING)
                .build());

        contactRepository.save(Contact.builder()
                .fullname("Nguyễn Thị Lan")
                .email("lan.nguyen@gmail.com")
                .phone("0966666666")
                .message("Cho tôi hỏi xe đạp trẻ em Merida Kids 20 còn hàng không?")
                .status(com.example.bike_shop.entity.enums.ContactStatus.PROCESSED)
                .build());

        contactRepository.save(Contact.builder()
                .fullname("Võ Minh Tuấn")
                .email("tuan.vo@gmail.com")
                .phone("0977777777")
                .message("Tôi cần tư vấn chọn xe touring đi phượt xuyên Việt.")
                .status(com.example.bike_shop.entity.enums.ContactStatus.PENDING)
                .build());

        // Notifications
        notificationRepository.save(Notification.builder()
                .user(customer1)
                .title("Chào mừng bạn đến với BikeShop!")
                .message("Cảm ơn bạn đã đăng ký tài khoản. Khám phá ngay các mẫu xe đạp mới nhất của shop.")
                .isRead(false)
                .build());

        notificationRepository.save(Notification.builder()
                .user(customer1)
                .title("Ưu đãi đặc biệt")
                .message("Giảm giá 10% cho đơn hàng đầu tiên khi thanh toán online. Áp dụng đến hết tháng.")
                .isRead(false)
                .build());

        notificationRepository.save(Notification.builder()
                .user(customer2)
                .title("Chào mừng bạn đến với BikeShop!")
                .message("Cảm ơn bạn đã đăng ký tài khoản. Khám phá ngay các mẫu xe đạp mới nhất của shop.")
                .isRead(true)
                .build());

        System.out.println("=== DataInitializer: đã seed dữ liệu mẫu thành công ===");
        System.out.println("Tài khoản admin: admin / admin123");
        System.out.println("Tài khoản khách hàng: customer1 / 123456, customer2 / 123456");
    }
}
