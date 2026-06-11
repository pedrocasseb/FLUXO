package com.pedrocasseb.fluxo.category.dto;

import com.pedrocasseb.fluxo.category.CategoryType;

import java.util.UUID;

public record CategoryResponse(UUID id,
                               String name,
                               CategoryType type) {
}
