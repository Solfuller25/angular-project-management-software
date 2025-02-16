package com.cooksys.groupfinal.services.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cooksys.groupfinal.dtos.BasicUserDto;
import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.dtos.FullUserDto;
import com.cooksys.groupfinal.dtos.UserRequestDto;
import com.cooksys.groupfinal.entities.Credentials;
import com.cooksys.groupfinal.entities.Profile;
import com.cooksys.groupfinal.entities.User;
import com.cooksys.groupfinal.exceptions.BadRequestException;
import com.cooksys.groupfinal.exceptions.NotAuthorizedException;
import com.cooksys.groupfinal.exceptions.NotFoundException;
import com.cooksys.groupfinal.mappers.BasicUserMapper;
import com.cooksys.groupfinal.mappers.CredentialsMapper;
import com.cooksys.groupfinal.mappers.FullUserMapper;
import com.cooksys.groupfinal.repositories.UserRepository;
import com.cooksys.groupfinal.services.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final FullUserMapper fullUserMapper;
	private final CredentialsMapper credentialsMapper;
	private final BasicUserMapper basicUserMapper;

	private User findUser(String username) {
		Optional<User> user = userRepository.findByCredentialsUsernameAndActiveTrue(username);
		if (user.isEmpty()) {
			throw new NotFoundException("The username provided does not belong to an active user.");
		}
		return user.get();
	}

	@Override
	public FullUserDto login(CredentialsDto credentialsDto) {
		if (credentialsDto == null || credentialsDto.getUsername() == null || credentialsDto.getPassword() == null) {
			throw new BadRequestException("A username and password are required.");
		}
		Credentials credentialsToValidate = credentialsMapper.dtoToEntity(credentialsDto);
		User userToValidate = findUser(credentialsDto.getUsername());
		if (!userToValidate.getCredentials().equals(credentialsToValidate)) {
			throw new NotAuthorizedException("The provided credentials are invalid.");
		}
		if (userToValidate.getStatus().equals("PENDING")) {
			userToValidate.setStatus("JOINED");
			userRepository.saveAndFlush(userToValidate);
		}
		return fullUserMapper.entityToFullUserDto(userToValidate);
	}

	@Override
	public List<BasicUserDto> getAllUsers() {
		// TODO Auto-generated method stub
		return userRepository.findAll().stream().map(basicUserMapper::entityToBasicUserDto)
				.collect(Collectors.toList());
	}

	@Override
	public FullUserDto createUser(UserRequestDto userRequestDto, Long adminId) {
		Optional<User> adminUser = userRepository.findById(adminId);
		if (adminUser.isEmpty()) {
			throw new NotFoundException("The username provided does not belong to an active user.");
		}
		if (!adminUser.get().isAdmin()) {
			throw new NotAuthorizedException("Only admins can create new users");
		}

		if (userRepository.findByCredentialsUsernameAndActiveTrue(userRequestDto.getCredentials().getUsername())
				.isPresent()) {
			throw new BadRequestException(
					"The username '" + userRequestDto.getCredentials().getUsername() + "' is already taken");
		}

		User newUser = new User();
		Credentials credentials = new Credentials();
		credentials.setUsername(userRequestDto.getCredentials().getUsername());
		credentials.setPassword(userRequestDto.getCredentials().getPassword());
		newUser.setCredentials(credentials);

		Profile profile = new Profile();
		profile.setFirstName(userRequestDto.getProfile().getFirstName());
		profile.setLastName(userRequestDto.getProfile().getLastName());
		profile.setEmail(userRequestDto.getProfile().getEmail());
		profile.setPhone(userRequestDto.getProfile().getPhone());
		newUser.setProfile(profile);

		newUser.setAdmin(userRequestDto.isAdmin());
		newUser.setActive(true);
		newUser.setStatus("PENDING");

		userRepository.saveAndFlush(newUser);

		return fullUserMapper.entityToFullUserDto(newUser);
	}

}
