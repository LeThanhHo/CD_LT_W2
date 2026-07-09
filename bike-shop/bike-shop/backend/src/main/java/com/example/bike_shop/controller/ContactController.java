package com.example.bike_shop.controller;

import com.example.bike_shop.dto.ContactDTO;
import com.example.bike_shop.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    /** Public: anyone (including guests) can submit a contact message. */
    @PostMapping
    public ResponseEntity<ContactDTO> submit(@Valid @RequestBody ContactDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contactService.submit(dto));
    }

    /** ADMIN: view all contact submissions. */
    @GetMapping
    public ResponseEntity<List<ContactDTO>> getAll() {
        return ResponseEntity.ok(contactService.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactDTO> markProcessed(@PathVariable Long id) {
        return ResponseEntity.ok(contactService.markProcessed(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        contactService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
