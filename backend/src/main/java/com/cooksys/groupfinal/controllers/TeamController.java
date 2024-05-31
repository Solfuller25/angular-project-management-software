package com.cooksys.groupfinal.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.cooksys.groupfinal.dtos.TeamDto;
import com.cooksys.groupfinal.services.TeamService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/team")
@RequiredArgsConstructor
public class TeamController {
	
	private final TeamService teamService;
	
	@GetMapping("/{teamId}")
	@ResponseStatus(HttpStatus.OK)
	public TeamDto getTeamById(@PathVariable Long teamId) {
		return teamService.getTeamById(teamId);
	}
	
	  @PostMapping("/{companyId}/company")
		@ResponseStatus(HttpStatus.CREATED)
		public TeamDto createTeam(@RequestBody TeamDto teamDto,  @RequestHeader("admin-id") Long id, @PathVariable Long companyId ) {
			return teamService.createTeams(teamDto, id, companyId);
		}

}