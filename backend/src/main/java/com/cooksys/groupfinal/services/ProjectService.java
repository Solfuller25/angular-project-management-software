package com.cooksys.groupfinal.services;

import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.dtos.ProjectDto;

public interface ProjectService {

    ProjectDto deleteProjectById(Long id, CredentialsDto credentialsDto);

	ProjectDto createProject(ProjectDto projectDto, Long id);
}
