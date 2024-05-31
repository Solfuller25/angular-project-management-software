package com.cooksys.groupfinal.services;

import java.util.Set;

import com.cooksys.groupfinal.dtos.AnnouncementDto;
import com.cooksys.groupfinal.dtos.FullUserDto;
import com.cooksys.groupfinal.dtos.ProjectDto;
import com.cooksys.groupfinal.dtos.TeamDto;

public interface CompanyService {

	Set<FullUserDto> getAllUsers(Long id);

	Set<AnnouncementDto> getAllAnnouncements(Long id);

	Set<TeamDto> getAllTeams(Long id);

	Set<ProjectDto> getAllProjects(Long companyId, Long teamId);

	ProjectDto updateProject(Long companyId, Long teamId, Long projectId, ProjectDto projectDto, Long adminId);

	FullUserDto updateUserCompanyActiveStatus(Long companyId, Long userId, Long adminId);

	FullUserDto updateUserCompanies(Long companyId, Set<Long> userIds, Long adminId);

	AnnouncementDto createAnnouncement(Long companyId, Long adminId, AnnouncementDto announcementDto);
}
