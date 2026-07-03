package com.pedrocasseb.fluxo.category.dto;

import com.pedrocasseb.fluxo.category.CategoryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateCategoryRequest(
    @NotBlank(message = "Name is required")
    String name,

    @NotNull(message = "Type is required")
    CategoryType type
) {}
