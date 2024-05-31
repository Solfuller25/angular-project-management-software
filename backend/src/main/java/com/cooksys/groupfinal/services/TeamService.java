package com.cooksys.groupfinal.services;

import com.cooksys.groupfinal.dtos.TeamDto;

public interface TeamService {

	TeamDto createTeams(TeamDto teamDto, Long id, Long companyId);

	TeamDto getTeamById(Long teamId);

}
