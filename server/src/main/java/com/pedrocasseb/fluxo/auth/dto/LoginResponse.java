package com.pedrocasseb.fluxo.auth.dto;

import com.pedrocasseb.fluxo.user.dto.UserResponse;

public record LoginResponse(String token, UserResponse user) {}
