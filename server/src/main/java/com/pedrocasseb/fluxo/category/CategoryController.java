package com.pedrocasseb.fluxo.category;

import com.pedrocasseb.fluxo.category.dto.CategoryResponse;
import com.pedrocasseb.fluxo.category.dto.CreateCategoryRequest;
import com.pedrocasseb.fluxo.category.dto.UpdateCategoryRequest;
import com.pedrocasseb.fluxo.user.User;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
  private final CategoryService categoryService;

  @PostMapping
  public ResponseEntity<CategoryResponse> createCategory(
      @RequestBody CreateCategoryRequest request,
      @AuthenticationPrincipal User user
  ) {
    return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.createCategory(request, user));
  }

  @GetMapping
  public ResponseEntity<List<CategoryResponse>> getAllCategories(@AuthenticationPrincipal User user) {
    return ResponseEntity.ok(categoryService.findAll(user));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteCategory(
      @PathVariable UUID id,
      @AuthenticationPrincipal User user
  ) {
    categoryService.delete(id, user);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}")
  public ResponseEntity<CategoryResponse> findById(
      @PathVariable UUID id,
      @AuthenticationPrincipal User user
  ) {
    return ResponseEntity.ok(categoryService.findById(id, user));
  }

  @PutMapping("/{id}")
  public ResponseEntity<CategoryResponse> updateCategory(
      @PathVariable UUID id,
      @Valid @RequestBody UpdateCategoryRequest request,
      @AuthenticationPrincipal User user
  ) {
    return ResponseEntity.ok(categoryService.updateCategory(id, request, user));
  }
}
