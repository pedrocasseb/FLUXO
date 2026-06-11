package com.pedrocasseb.fluxo.category.dto;

import com.pedrocasseb.fluxo.category.CategoryType;

public record CreateCategoryRequest(String name, CategoryType type) {}
