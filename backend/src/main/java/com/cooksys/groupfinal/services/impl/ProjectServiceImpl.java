package com.cooksys.groupfinal.services.impl;

import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.dtos.ProjectDto;
import com.cooksys.groupfinal.entities.Project;
import com.cooksys.groupfinal.entities.Team;
import com.cooksys.groupfinal.entities.User;
import com.cooksys.groupfinal.exceptions.BadRequestException;
import com.cooksys.groupfinal.exceptions.NotFoundException;
import com.cooksys.groupfinal.mappers.ProjectMapper;
import com.cooksys.groupfinal.repositories.ProjectRepository;
import com.cooksys.groupfinal.repositories.TeamRepository;
import com.cooksys.groupfinal.repositories.UserRepository;
import org.springframework.stereotype.Service;

import com.cooksys.groupfinal.services.ProjectService;

import lombok.RequiredArgsConstructor;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    
	private Team findTeam(Long id) {
        Optional<Team> team = teamRepository.findById(id);
        if (team.isEmpty()) {
            throw new NotFoundException("The team does not exist.");
        }
        return team.get();
    }
	

    public ProjectDto deleteProjectById(Long id, CredentialsDto credentialsDto){
        Optional<User> optionalUser = userRepository.findByCredentialsUsernameAndActiveTrue(credentialsDto.getUsername());
        if (optionalUser.isEmpty() || !optionalUser.get().isActive()){
            throw new NotFoundException("Credentials does not match an existing user");
        }

        User retrievedUser = optionalUser.get();
        if (!retrievedUser.isAdmin()){
            throw new BadRequestException("User does not have ability to delete project");
        }

        Optional<Project> optionalProject = projectRepository.findById(id);
        if (optionalProject.isEmpty()){
            throw new NotFoundException("Project ID not found");
        }

        Project retrievedProject = optionalProject.get();

        retrievedProject.setActive(false);
        projectRepository.saveAndFlush(retrievedProject);

        return projectMapper.entityToDto(retrievedProject);
    }
    
    
	@Override
	public ProjectDto createProject(ProjectDto projectDto,Long id) 
	{
		
		Team team  = teamRepository.findById(id).get();
		Project project = projectMapper.requestDToEntity(projectDto);
		project.setTeam(team);
		Project saved_project = projectRepository.saveAndFlush(project);

		return projectMapper.entityToDto(saved_project);
	}
}
