package com.pedrocasseb.fluxo.category.dto;

import com.pedrocasseb.fluxo.category.CategoryType;

public record UpdateCategoryRequest(String name, CategoryType type) {}
