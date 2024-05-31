package com.cooksys.groupfinal.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.dtos.ProjectDto;
import com.cooksys.groupfinal.services.ProjectService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {
	
	private final ProjectService projectService;

	@DeleteMapping("/{id}")
	public ProjectDto deleteProjectById(@PathVariable Long id, @RequestBody CredentialsDto credentialsDto){
		return projectService.deleteProjectById(id, credentialsDto);

	}
	
	@PostMapping("/{id}/teams")
	@ResponseStatus(HttpStatus.CREATED)
	public ProjectDto createProject(@RequestBody ProjectDto projectDto,  @PathVariable Long id) {
		return projectService.createProject(projectDto,id);
	}

}
