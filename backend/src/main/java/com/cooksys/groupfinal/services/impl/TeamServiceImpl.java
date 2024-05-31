package com.cooksys.groupfinal.services.impl;

import java.util.Optional;



import org.springframework.stereotype.Service;

import com.cooksys.groupfinal.dtos.TeamDto;
import com.cooksys.groupfinal.entities.User;
import com.cooksys.groupfinal.entities.Company;
import com.cooksys.groupfinal.entities.Team;
import com.cooksys.groupfinal.exceptions.NotAuthorizedException;
import com.cooksys.groupfinal.exceptions.NotFoundException;
import com.cooksys.groupfinal.mappers.TeamMapper;
import com.cooksys.groupfinal.repositories.CompanyRepository;
import com.cooksys.groupfinal.repositories.TeamRepository;
import com.cooksys.groupfinal.repositories.UserRepository;
import com.cooksys.groupfinal.services.TeamService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {
	
	private final UserRepository userRepository;
	private final TeamRepository teamRepository;
	private final TeamMapper teamMapper;
	private final CompanyRepository companyRepository;
	
	
	private User findUser(Long id) {
        Optional<User> user = userRepository.findByidAndActiveTrue(id);
        if (user.isEmpty()) {
            throw new NotFoundException("The username provided does not belong to an active user.");
        }
        return user.get();
    }
	
	private Company findCompany(Long id) {
        Optional<Company> company = companyRepository.findById(id);
        if (company.isEmpty()) {
            throw new NotFoundException("A company with the provided id does not exist.");
        }
        return company.get();
    }
	
	
	
	@Override
	public TeamDto createTeams(TeamDto teamDto, Long id, Long companyId) 
	{
		User admin = findUser(id);
		if(!admin.isAdmin())
		{
			throw new NotAuthorizedException("The user is not an admin");
		}
		
		 Team new_team = teamMapper.requestDtoEntity(teamDto);
		 
		 Company comp =  findCompany(companyId);
		 
		 
		 for(Company company: admin.getCompanies())
		 {
			 if(company.equals(comp))
			 {
				 new_team.setCompany(company);
			 }
		 }
		
		 
		 Team saved_team = teamRepository.saveAndFlush(new_team);
		 
		 admin.getTeams().add(saved_team);
		 
		  userRepository.saveAndFlush(admin);
		 
		 
		 
		 return teamMapper.entityToDto(saved_team);
		
	
	}

	@Override
	public TeamDto getTeamById(Long teamId) {
		return teamMapper.entityToDto(teamRepository.findById(teamId).get());
	}
	
	
	
	
	
	

	
	

	
	
}