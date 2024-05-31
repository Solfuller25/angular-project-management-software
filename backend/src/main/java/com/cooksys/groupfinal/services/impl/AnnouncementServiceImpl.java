package com.cooksys.groupfinal.services.impl;

import com.cooksys.groupfinal.dtos.AnnouncementDto;
import com.cooksys.groupfinal.entities.Announcement;
import com.cooksys.groupfinal.entities.User;
import com.cooksys.groupfinal.exceptions.BadRequestException;
import com.cooksys.groupfinal.mappers.AnnouncementMapper;
import com.cooksys.groupfinal.repositories.AnnouncementRepository;
import com.cooksys.groupfinal.repositories.UserRepository;
import org.springframework.stereotype.Service;

import com.cooksys.groupfinal.services.AnnouncementService;

import lombok.RequiredArgsConstructor;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AnnouncementServiceImpl implements AnnouncementService {

    private UserRepository userRepository;
    private AnnouncementRepository announcementRepository;

    private AnnouncementMapper announcementMapper;

    @Override
    public Set<AnnouncementDto> findAllAnnouncements(){
        return announcementMapper.entitiesToDtos(new HashSet<>(announcementRepository.findAll()));
    }

    @Override
    public Set<AnnouncementDto> findAllUserAnnouncements(Long id){
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()){
            throw new BadRequestException("User ID not found");
        }

        User retrievedUser = optionalUser.get();
        List<Announcement> allAnnouncements = announcementRepository.findAll();
        Set<Announcement> userAnnouncements = new HashSet<>();

        for (Announcement announcement: allAnnouncements){
            if (announcement.getAuthor().equals(retrievedUser)){
                userAnnouncements.add(announcement);
            }
        }

        return announcementMapper.entitiesToDtos(userAnnouncements);
    }
}