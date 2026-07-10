package com.example.bike_shop.service.impl;

import com.example.bike_shop.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendPasswordResetEmail(String toEmail, String fullname, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject("BikeShop - Yêu cầu đặt lại mật khẩu");
            helper.setText(
                    "<p>Xin chào " + fullname + ",</p>" +
                            "<p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>" +
                            "<p><a href=\"" + resetLink + "\">Bấm vào đây để đặt lại mật khẩu</a></p>" +
                            "<p>Liên kết này sẽ hết hạn sau 30 phút. Nếu bạn không yêu cầu thay đổi này, " +
                            "vui lòng bỏ qua email.</p>",
                    true
            );
            mailSender.send(message);
        } catch (MessagingException e) {
            // Ghi log thay vì ném lỗi, để sự cố gửi mail không làm hỏng phản hồi API
            log.error("Không thể gửi email đặt lại mật khẩu đến {}: {}", toEmail, e.getMessage());
        }
    }
}