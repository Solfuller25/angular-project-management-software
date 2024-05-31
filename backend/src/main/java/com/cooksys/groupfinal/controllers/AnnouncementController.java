package com.cooksys.groupfinal.controllers;

import com.cooksys.groupfinal.dtos.AnnouncementDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cooksys.groupfinal.services.AnnouncementService;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/announcements")
@RequiredArgsConstructor
public class AnnouncementController {
	
	private final AnnouncementService announcementService;

	@GetMapping
	private Set<AnnouncementDto> findAllAnnouncements(){
		return announcementService.findAllAnnouncements();
	}

	@GetMapping("/{id}")
	private Set<AnnouncementDto> findAllUserAnnouncements(@PathVariable Long id){
		return announcementService.findAllUserAnnouncements(id);
	}
}
