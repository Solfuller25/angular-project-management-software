package com.cooksys.groupfinal.services.impl;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.cooksys.groupfinal.dtos.AnnouncementDto;
import com.cooksys.groupfinal.dtos.FullUserDto;
import com.cooksys.groupfinal.dtos.ProjectDto;
import com.cooksys.groupfinal.dtos.TeamDto;
import com.cooksys.groupfinal.entities.Announcement;
import com.cooksys.groupfinal.entities.Company;
import com.cooksys.groupfinal.entities.Project;
import com.cooksys.groupfinal.entities.Team;
import com.cooksys.groupfinal.entities.User;
import com.cooksys.groupfinal.exceptions.BadRequestException;
import com.cooksys.groupfinal.exceptions.NotFoundException;
import com.cooksys.groupfinal.mappers.AnnouncementMapper;
import com.cooksys.groupfinal.mappers.FullUserMapper;
import com.cooksys.groupfinal.mappers.ProjectMapper;
import com.cooksys.groupfinal.mappers.TeamMapper;
import com.cooksys.groupfinal.repositories.AnnouncementRepository;
import com.cooksys.groupfinal.repositories.CompanyRepository;
import com.cooksys.groupfinal.repositories.ProjectRepository;
import com.cooksys.groupfinal.repositories.TeamRepository;
import com.cooksys.groupfinal.repositories.UserRepository;
import com.cooksys.groupfinal.services.CompanyService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

	private final CompanyRepository companyRepository;
	private final TeamRepository teamRepository;
	private final UserRepository userRepository;
	private final ProjectRepository projectRepository;
	private final AnnouncementRepository announcementRepository;
	private final FullUserMapper fullUserMapper;
	private final AnnouncementMapper announcementMapper;
	private final TeamMapper teamMapper;
	private final ProjectMapper projectMapper;

	private Company findCompany(Long id) {
		Optional<Company> company = companyRepository.findById(id);
		if (company.isEmpty()) {
			throw new NotFoundException("A company with the provided id does not exist.");
		}
		return company.get();
	}

	private Team findTeam(Long id) {
		Optional<Team> team = teamRepository.findById(id);
		if (team.isEmpty()) {
			throw new NotFoundException("A team with the provided id does not exist.");
		}
		return team.get();
	}

	@Override
	public Set<FullUserDto> getAllUsers(Long id) {
		Company company = findCompany(id);
		Set<User> filteredUsers = new HashSet<>();
		company.getEmployees().forEach(filteredUsers::add);
		return fullUserMapper.entitiesToFullUserDtos(filteredUsers);
	}

	@Override
	public Set<AnnouncementDto> getAllAnnouncements(Long id) {
		Company company = findCompany(id);
		List<Announcement> sortedList = new ArrayList<Announcement>(company.getAnnouncements());
		sortedList.sort(Comparator.comparing(Announcement::getDate).reversed());
		Set<Announcement> sortedSet = new HashSet<Announcement>(sortedList);
		return announcementMapper.entitiesToDtos(sortedSet);
	}

	@Override
	public Set<TeamDto> getAllTeams(Long id) {
		Company company = findCompany(id);
		return teamMapper.entitiesToDtos(company.getTeams());
	}

	@Override
	public Set<ProjectDto> getAllProjects(Long companyId, Long teamId) {
		Company company = findCompany(companyId);
		Team team = findTeam(teamId);
		if (!company.getTeams().contains(team)) {
			throw new NotFoundException(
					"A team with id " + teamId + " does not exist at company with id " + companyId + ".");
		}
		Set<Project> filteredProjects = new HashSet<>();
		team.getProjects().forEach(filteredProjects::add);
		return projectMapper.entitiesToDtos(filteredProjects);
	}

	@Override
	public ProjectDto updateProject(Long companyId, Long teamId, Long projectId, ProjectDto projectDto, Long adminId) {
		Optional<User> admin = userRepository.findByidAndActiveTrue(adminId);
		if (admin.isEmpty() || !admin.get().isAdmin()) {
			throw new BadRequestException("Must be admin to update a project");
		}
		Optional<Company> optionalCompany = companyRepository.findById(companyId);
		Optional<Team> optionalTeam = teamRepository.findById(teamId);
		if (optionalCompany.isEmpty()) {
			throw new NotFoundException("Company not found");
		}
		if (optionalTeam.isEmpty()) {
			throw new NotFoundException("Team not found");
		}
		Optional<Project> optionalProject = projectRepository.findById(projectId);
		if (optionalProject.isEmpty()) {
			throw new NotFoundException("Project not found");
		}

		// Should we consider being able to change the team as well?
		Project retrievedProject = optionalProject.get();

		retrievedProject.setActive(projectDto.isActive());
		retrievedProject.setName(projectDto.getName());
		retrievedProject.setDescription(projectDto.getDescription());

		projectRepository.save(retrievedProject);

		return projectMapper.entityToDto(retrievedProject);

	}

	@Override
	public FullUserDto updateUserCompanyActiveStatus(Long companyId, Long userId, Long adminId) {
		Optional<User> optionalAdmin = userRepository.findById(adminId);
		if (optionalAdmin.isEmpty()) {
			throw new BadRequestException("Admin username not found");
		}

		if (!optionalAdmin.get().isAdmin()) {
			throw new BadRequestException("Only Admins can alter statuses");
		}

		Optional<Company> optionalCompany = companyRepository.findById(companyId);
		if (optionalCompany.isEmpty()) {
			throw new BadRequestException("Company not found");
		}

		Optional<User> optionalUser = userRepository.findById(userId);
		if (optionalUser.isEmpty()) {
			throw new BadRequestException("User not found");
		}

		User retrievedUser = optionalUser.get();
		retrievedUser.setActive(!retrievedUser.isActive());

		userRepository.save(retrievedUser);

		return fullUserMapper.entityToFullUserDto(retrievedUser);
	}

	@Override
	public FullUserDto updateUserCompanies(Long companyId, Set<Long> userIds, Long adminId) {
		Optional<User> optionalAdmin = userRepository.findById(adminId);
		if (optionalAdmin.isEmpty()) {
			throw new BadRequestException("Admin username not found");
		}
		Optional<Company> optionalCompany = companyRepository.findById(companyId);
		if (optionalCompany.isEmpty()) {
			throw new NotFoundException("Company not found");
		}

		Company company = optionalCompany.get();

		Set<User> users = new HashSet<>();
		for (Long userId : userIds) {
			Optional<User> user = userRepository.findById(userId);
			if (user.isEmpty()) {
				throw new NotFoundException("User with ID " + userId + " not found");
			}
			users.add(user.get());
		}

		company.getEmployees().addAll(users);
		companyRepository.saveAndFlush(company);

		for (User user : users) {
			user.getCompanies().add(company);
			userRepository.saveAndFlush(user);
		}

		return fullUserMapper.entityToFullUserDto(company);
	}

	@Override
	public AnnouncementDto createAnnouncement(Long companyId, Long adminId, AnnouncementDto announcementDto) {
		Optional<User> optionalAdmin = userRepository.findByidAndActiveTrue(adminId);
		if (optionalAdmin.isEmpty()) {
			throw new BadRequestException("Admin username not found");
		}
		if (!optionalAdmin.get().isAdmin()) {
			throw new BadRequestException("User is not authorized to create announcements");
		}
		Optional<Company> optionalCompany = companyRepository.findById(companyId);
		if (optionalCompany.isEmpty()) {
			throw new NotFoundException("Company not found");
		}
		if(announcementDto.getMessage().isBlank() || announcementDto.getTitle().isBlank()) {
			throw new BadRequestException("Please provide both a title and a message");
		}
		Announcement announcement = new Announcement();
		announcement.setDate(Timestamp.valueOf(LocalDateTime.now()));
		announcement.setTitle(announcementDto.getTitle());
		announcement.setMessage(announcementDto.getMessage());
		announcement.setAuthor(optionalAdmin.get());
		announcement.setCompany(optionalCompany.get());

		announcement = announcementRepository.saveAndFlush(announcement);

		return announcementMapper.entityToDto(announcement);
	}
}
