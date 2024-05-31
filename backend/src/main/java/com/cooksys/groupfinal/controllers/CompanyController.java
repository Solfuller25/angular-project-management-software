package com.cooksys.groupfinal.controllers;

import java.util.Set;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cooksys.groupfinal.dtos.AnnouncementDto;
import com.cooksys.groupfinal.dtos.FullUserDto;
import com.cooksys.groupfinal.dtos.ProjectDto;
import com.cooksys.groupfinal.dtos.TeamDto;
import com.cooksys.groupfinal.services.CompanyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/company")
@RequiredArgsConstructor
public class CompanyController {

	private final CompanyService companyService;

	@GetMapping("/{id}/users")
	public Set<FullUserDto> getAllUsers(@PathVariable Long id) {
		return companyService.getAllUsers(id);
	}

	@GetMapping("/{id}/announcements")
	public Set<AnnouncementDto> getAllAnnouncements(@PathVariable Long id) {
		return companyService.getAllAnnouncements(id);
	}

	@GetMapping("/{id}/teams")
	public Set<TeamDto> getAllTeams(@PathVariable Long id) {
		return companyService.getAllTeams(id);
	}

	@GetMapping("/{companyId}/teams/{teamId}/projects")
	public Set<ProjectDto> getAllProjects(@PathVariable Long companyId, @PathVariable Long teamId) {
		return companyService.getAllProjects(companyId, teamId);
	}

	@PatchMapping("/{companyId}/teams/{teamId}/projects/{projectId}")
	public ProjectDto updateProject(@PathVariable Long companyId, @PathVariable Long teamId,
			@PathVariable Long projectId, @RequestBody ProjectDto projectDto, @RequestHeader("admin-id") Long adminId) {
		return companyService.updateProject(companyId, teamId, projectId, projectDto, adminId);
	}

	@PatchMapping("/{companyId}/user/{userId}")
	public FullUserDto updateUserCompanyActiveStatus(@PathVariable Long companyId, @PathVariable Long userId,
			@RequestHeader("admin-id") Long adminId) {
		return companyService.updateUserCompanyActiveStatus(companyId, userId, adminId);
	}

	@PatchMapping("/{companyId}/users")
	public FullUserDto updateUserCompanies(@PathVariable Long companyId, @RequestBody Set<Long> userIds,
			@RequestHeader("admin-id") Long adminId) {
		return companyService.updateUserCompanies(companyId, userIds, adminId);
	}

	@PostMapping("/{companyId}/announcement")
	public AnnouncementDto createAnnouncement(@PathVariable Long companyId, @RequestHeader("admin-id") Long adminId,
			@RequestBody AnnouncementDto announcementDto) {
		return companyService.createAnnouncement(companyId, adminId, announcementDto);
	}
}
