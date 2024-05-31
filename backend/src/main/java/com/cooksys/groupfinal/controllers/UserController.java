package com.cooksys.groupfinal.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cooksys.groupfinal.dtos.BasicUserDto;
import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.dtos.FullUserDto;
import com.cooksys.groupfinal.dtos.UserRequestDto;
import com.cooksys.groupfinal.services.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	@PostMapping("/login")
	@CrossOrigin(origins = "*")
	public FullUserDto login(@RequestBody CredentialsDto credentialsDto) {
		return userService.login(credentialsDto);
	}

	@GetMapping()
	public List<BasicUserDto> allUsers() {
		return userService.getAllUsers();
	}

	@PostMapping()
	public FullUserDto createUser(@RequestBody UserRequestDto userRequestDto, @RequestHeader("admin-id") Long adminId) {
		return userService.createUser(userRequestDto, adminId);
	}

}
