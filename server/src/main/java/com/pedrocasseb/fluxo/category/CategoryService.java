package com.pedrocasseb.fluxo.category;

import com.pedrocasseb.fluxo.category.dto.CategoryResponse;
import com.pedrocasseb.fluxo.category.dto.CreateCategoryRequest;
import com.pedrocasseb.fluxo.category.dto.UpdateCategoryRequest;
import com.pedrocasseb.fluxo.common.exception.CategoryNotFoundException;
import com.pedrocasseb.fluxo.user.User;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryService {

  private final CategoryRepository categoryRepository;

  public CategoryResponse createCategory(CreateCategoryRequest request, User user) {
    Category category = new Category();
    category.setName(request.name());
    category.setType(request.type());
    category.setUser(user);

    Category saved = categoryRepository.save(category);

    return new CategoryResponse(saved.getId(), saved.getName(), saved.getType());
  }

  public List<CategoryResponse> findAll(User user) {
    return categoryRepository.findByUser(user).stream()
        .map(
            category ->
                new CategoryResponse(category.getId(), category.getName(), category.getType()))
        .toList();
  }

  public void delete(UUID id, User user) {
    Category category = categoryRepository.findByIdAndUser(id, user)
        .orElseThrow(() -> new CategoryNotFoundException("Categoria não encontrada"));
    categoryRepository.delete(category);
  }

  public CategoryResponse findById(UUID id, User user) {
    Category category = categoryRepository.findByIdAndUser(id, user)
        .orElseThrow(() -> new CategoryNotFoundException("Categoria não encontrada"));
    return new CategoryResponse(category.getId(), category.getName(), category.getType());
  }

  public CategoryResponse updateCategory(UUID id, UpdateCategoryRequest request, User user) {
    Category category = categoryRepository.findByIdAndUser(id, user)
        .orElseThrow(() -> new CategoryNotFoundException("Categoria não encontrada"));
    if (request.name() != null) {
      category.setName(request.name());
    }
    if (request.type() != null) {
      category.setType(request.type());
    }
    Category saved = categoryRepository.save(category);
    return new CategoryResponse(saved.getId(), saved.getName(), saved.getType());
  }
}
