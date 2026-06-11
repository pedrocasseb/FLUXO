package com.pedrocasseb.fluxo.category;

import com.pedrocasseb.fluxo.category.dto.CategoryResponse;
import com.pedrocasseb.fluxo.category.dto.CreateCategoryRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryResponse createCategory(CreateCategoryRequest request ){

        Category category = new Category();
        category.setName(request.name());
        category.setType(request.type());

        Category saved = categoryRepository.save(category);

        return new CategoryResponse(
            saved.getId(),
            saved.getName(),
            saved.getType()
        );
    }

    public List<CategoryResponse> findAll() {
        return categoryRepository.findAll()
                .stream().map(category -> new CategoryResponse(
                        category.getId(),
                        category.getName(),
                        category.getType()
                )).toList();
    }
}
