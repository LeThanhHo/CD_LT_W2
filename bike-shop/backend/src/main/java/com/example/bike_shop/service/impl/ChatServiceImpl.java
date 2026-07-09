package com.example.bike_shop.service.impl;

import com.example.bike_shop.dto.ChatDTO;
import com.example.bike_shop.dto.ProductDTO;
import com.example.bike_shop.entity.Brand;
import com.example.bike_shop.entity.Category;
import com.example.bike_shop.entity.Product;
import com.example.bike_shop.mapper.ProductMapper;
import com.example.bike_shop.repository.BrandRepository;
import com.example.bike_shop.repository.CategoryRepository;
import com.example.bike_shop.repository.ProductRepository;
import com.example.bike_shop.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Rule-based assistant that answers customer questions using real data from
 * the shop's own database (products, categories, brands, prices).
 * <p>
 * This is intentionally kept provider-agnostic: {@link #reply(String)} is the
 * single integration point. To upgrade to a real LLM (OpenAI / Gemini), swap
 * the body of this method to call the external API — optionally still using
 * {@link #findRelevantProducts(String)} to feed the model real catalog data
 * (a lightweight RAG pattern) instead of letting it hallucinate prices/stock.
 */
@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductMapper productMapper;

    private static final int MAX_SUGGESTIONS = 4;

    @Override
    public ChatDTO.ChatResponse reply(String message) {
        String normalized = normalize(message);

        if (containsAny(normalized, "giao hang", "ship", "van chuyen", "phi ship", "giao nhanh")) {
            return ChatDTO.ChatResponse.builder()
                    .reply("Shop hỗ trợ giao hàng toàn quốc. Miễn phí vận chuyển cho mọi đơn hàng, " +
                            "thời gian giao dự kiến 2-5 ngày tùy khu vực. Bạn có thể chọn thanh toán COD " +
                            "(trả tiền khi nhận hàng) hoặc chuyển khoản/thẻ ngay khi đặt.")
                    .build();
        }

        if (containsAny(normalized, "bao hanh", "doi tra", "hoan tien")) {
            return ChatDTO.ChatResponse.builder()
                    .reply("Tất cả xe đạp tại shop đều được bảo hành chính hãng theo tiêu chuẩn của nhà sản xuất. " +
                            "Nếu có vấn đề về chất lượng trong 7 ngày đầu, bạn liên hệ shop qua trang Liên hệ để được hỗ trợ đổi/trả.")
                    .build();
        }

        if (containsAny(normalized, "thanh toan", "tra gop", "cod")) {
            return ChatDTO.ChatResponse.builder()
                    .reply("Shop hỗ trợ nhiều hình thức thanh toán: COD (thanh toán khi nhận hàng), " +
                            "chuyển khoản ngân hàng, thẻ tín dụng/ghi nợ, ví MoMo và VNPay.")
                    .build();
        }

        // Try to find matching products based on keywords in the question
        // (category name, brand name, or free-text match against name/description).
        List<Product> matches = findRelevantProducts(normalized);

        if (containsAny(normalized, "gia", "bao nhieu tien", "bao nhieu")) {
            if (!matches.isEmpty()) {
                String priceList = matches.stream()
                        .limit(MAX_SUGGESTIONS)
                        .map(p -> "- " + p.getName() + ": " + formatPrice(p.getPrice()))
                        .collect(Collectors.joining("\n"));
                return ChatDTO.ChatResponse.builder()
                        .reply("Đây là một số mức giá bạn có thể tham khảo:\n" + priceList)
                        .suggestedProducts(toDTOs(matches))
                        .build();
            }
            return ChatDTO.ChatResponse.builder()
                    .reply("Giá xe đạp tại shop dao động từ vài triệu (xe trẻ em, xe đường phố) " +
                            "đến vài chục triệu đồng (xe điện, xe địa hình cao cấp). Bạn cho mình biết " +
                            "loại xe hoặc mục đích sử dụng để mình tư vấn cụ thể hơn nhé!")
                    .build();
        }

        if (!matches.isEmpty()) {
            String names = matches.stream()
                    .limit(MAX_SUGGESTIONS)
                    .map(Product::getName)
                    .collect(Collectors.joining(", "));
            return ChatDTO.ChatResponse.builder()
                    .reply("Dựa trên nhu cầu của bạn, shop gợi ý các mẫu xe sau: " + names +
                            ". Bạn có thể bấm vào sản phẩm bên dưới để xem chi tiết.")
                    .suggestedProducts(toDTOs(matches))
                    .build();
        }

        return ChatDTO.ChatResponse.builder()
                .reply("Cảm ơn bạn đã nhắn tin! Mình chưa tìm thấy sản phẩm phù hợp với câu hỏi này. " +
                        "Bạn có thể mô tả rõ hơn (ví dụ: loại xe, mức giá, mục đích sử dụng) hoặc để lại " +
                        "thông tin ở trang Liên hệ, đội ngũ shop sẽ hỗ trợ bạn nhanh nhất.")
                .build();
    }

    private List<Product> findRelevantProducts(String normalizedMessage) {
        List<Product> results = new ArrayList<>();

        // Match by category (e.g. "đường dài" -> touring, "địa hình"/"mtb" -> mountain, "trẻ em" -> kids, "điện" -> electric)
        for (Category category : categoryRepository.findAll()) {
            if (normalizedMessage.contains(normalize(category.getName()))) {
                results.addAll(productRepository.findAll().stream()
                        .filter(p -> p.getCategory() != null && p.getCategory().getId().equals(category.getId()))
                        .collect(Collectors.toList()));
            }
        }

        // Match by brand name
        for (Brand brand : brandRepository.findAll()) {
            if (normalizedMessage.contains(normalize(brand.getName()))) {
                results.addAll(productRepository.findAll().stream()
                        .filter(p -> p.getBrand() != null && p.getBrand().getId().equals(brand.getId()))
                        .collect(Collectors.toList()));
            }
        }

        // Common intent keywords mapped to category-ish hints
        if (containsAny(normalizedMessage, "duong dai", "touring", "phuot")) {
            results.addAll(searchByKeyword("touring"));
        }
        if (containsAny(normalizedMessage, "dia hinh", "mtb", "leo nui", "off-road", "offroad")) {
            results.addAll(searchByKeyword("mountain"));
            results.addAll(searchByKeyword("dia hinh"));
        }
        if (containsAny(normalizedMessage, "tre em", "cho be", "xe con nit")) {
            results.addAll(searchByKeyword("tre em"));
            results.addAll(searchByKeyword("kids"));
        }
        if (containsAny(normalizedMessage, "xe dien", "tro luc dien", "pin")) {
            results.addAll(searchByKeyword("dien"));
        }

        // Fallback: free-text search against product name/description
        if (results.isEmpty()) {
            results.addAll(freeTextSearch(normalizedMessage));
        }

        return results.stream().distinct().limit(MAX_SUGGESTIONS).collect(Collectors.toList());
    }

    private List<Product> searchByKeyword(String keyword) {
        String normKeyword = normalize(keyword);
        return productRepository.findAll().stream()
                .filter(p -> normalize(p.getName()).contains(normKeyword)
                        || (p.getDescription() != null && normalize(p.getDescription()).contains(normKeyword))
                        || (p.getCategory() != null && normalize(p.getCategory().getName()).contains(normKeyword)))
                .collect(Collectors.toList());
    }

    private List<Product> freeTextSearch(String normalizedMessage) {
        String[] words = normalizedMessage.split("\\s+");
        return productRepository.findAll().stream()
                .filter(p -> {
                    String haystack = normalize(p.getName() + " " + (p.getDescription() != null ? p.getDescription() : ""));
                    for (String word : words) {
                        if (word.length() >= 4 && haystack.contains(word)) {
                            return true;
                        }
                    }
                    return false;
                })
                .collect(Collectors.toList());
    }

    private List<ProductDTO> toDTOs(List<Product> products) {
        return products.stream().limit(MAX_SUGGESTIONS).map(productMapper::toDTO).collect(Collectors.toList());
    }

    private boolean containsAny(String text, String... keywords) {
        for (String k : keywords) {
            if (text.contains(k)) return true;
        }
        return false;
    }

    private String formatPrice(java.math.BigDecimal price) {
        return java.text.NumberFormat.getInstance(new Locale("vi", "VN")).format(price) + " VND";
    }

    /** Lowercases and strips Vietnamese diacritics for loose keyword matching. */
    private String normalize(String input) {
        if (input == null) return "";
        String norm = Normalizer.normalize(input, Normalizer.Form.NFD);
        norm = Pattern.compile("\\p{InCombiningDiacriticalMarks}+").matcher(norm).replaceAll("");
        norm = norm.replace('đ', 'd').replace('Đ', 'D');
        return norm.toLowerCase(Locale.ROOT);
    }
}
