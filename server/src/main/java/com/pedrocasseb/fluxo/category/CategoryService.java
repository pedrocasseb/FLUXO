package com.pedrocasseb.fluxo.category;

import com.pedrocasseb.fluxo.category.dto.CategoryResponse;
import com.pedrocasseb.fluxo.category.dto.CreateCategoryRequest;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryService {

  private final CategoryRepository categoryRepository;

  public CategoryResponse createCategory(CreateCategoryRequest request) {
    Category category = new Category();
    category.setName(request.name());
    category.setType(request.type());

    Category saved = categoryRepository.save(category);

    return new CategoryResponse(saved.getId(), saved.getName(), saved.getType());
  }

  public List<CategoryResponse> findAll() {
    return categoryRepository.findAll().stream()
        .map(
            category ->
                new CategoryResponse(category.getId(), category.getName(), category.getType()))
        .toList();
  }

  public void delete(UUID id) {
    if (!categoryRepository.existsById(id)) {
      throw new RuntimeException("Category not found");
    }
    categoryRepository.deleteById(id);
  }

  public CategoryResponse findById(UUID id) {
    Optional<Category> category = categoryRepository.findById(id);
    if (category.isPresent()) {
      return new CategoryResponse(
          category.get().getId(), category.get().getName(), category.get().getType());
    } else {
      throw new RuntimeException("Category not found");
    }
  }
}
