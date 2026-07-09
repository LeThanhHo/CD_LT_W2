package com.example.bike_shop.service.impl;

import com.example.bike_shop.dto.ContactDTO;
import com.example.bike_shop.entity.Contact;
import com.example.bike_shop.entity.enums.ContactStatus;
import com.example.bike_shop.exception.ResourceNotFoundException;
import com.example.bike_shop.mapper.ContactMapper;
import com.example.bike_shop.repository.ContactRepository;
import com.example.bike_shop.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;
    private final ContactMapper contactMapper;

    @Override
    public ContactDTO submit(ContactDTO dto) {
        Contact contact = contactMapper.toEntity(dto);
        return contactMapper.toDTO(contactRepository.save(contact));
    }

    @Override
    public List<ContactDTO> getAll() {
        return contactRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(contactMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ContactDTO markProcessed(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy liên hệ id=" + id));
        contact.setStatus(ContactStatus.PROCESSED);
        return contactMapper.toDTO(contactRepository.save(contact));
    }

    @Override
    public void delete(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy liên hệ id=" + id);
        }
        contactRepository.deleteById(id);
    }
}
