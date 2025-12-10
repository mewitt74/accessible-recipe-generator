/**
 * Pre-defined Photos for Basic Recipes
 * Using reliable Unsplash photo URLs for consistent imagery
 */

export interface RecipePhoto {
  recipeId: string;
  mainPhoto: string;
  stepPhotos: { [stepNumber: number]: string };
  ingredientPhotos: { [ingredient: string]: string };
  equipmentPhotos: { [equipment: string]: string };
}

// High-quality Unsplash photos for basic recipes
export const basicRecipePhotos: { [recipeId: string]: RecipePhoto } = {
  'basic-fried-egg': {
    recipeId: 'basic-fried-egg',
    mainPhoto: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=600&fit=crop',
    stepPhotos: {
      1: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop', // pan on stove
      2: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&h=400&fit=crop', // butter in pan
      3: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&h=400&fit=crop', // cracking egg
      4: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&h=400&fit=crop', // cooking egg
      5: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&h=400&fit=crop', // fried egg on plate
      6: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&h=400&fit=crop' // finished fried egg
    },
    ingredientPhotos: {
      'Egg': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop',
      'Butter': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=200&h=200&fit=crop',
      'Salt': 'https://images.unsplash.com/photo-1533093818801-e0e41c2d8c1a?w=200&h=200&fit=crop',
      'Pepper': 'https://images.unsplash.com/photo-1588908437515-b3a05218e4e7?w=200&h=200&fit=crop'
    },
    equipmentPhotos: {
      'Small Frying Pan': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop',
      'Spatula': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop',
      'Plate': 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=200&h=200&fit=crop'
    }
  },
  'basic-scrambled-eggs': {
    recipeId: 'basic-scrambled-eggs',
    mainPhoto: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800&h=600&fit=crop',
    stepPhotos: {
      1: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&h=400&fit=crop', // eggs in bowl
      2: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600&h=400&fit=crop', // beating eggs
      3: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop', // pan on stove
      4: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600&h=400&fit=crop', // pouring eggs
      5: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600&h=400&fit=crop', // stirring eggs
      6: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600&h=400&fit=crop' // scrambled eggs done
    },
    ingredientPhotos: {
      'Eggs': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop',
      'Butter': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=200&h=200&fit=crop',
      'Milk': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop',
      'Salt': 'https://images.unsplash.com/photo-1533093818801-e0e41c2d8c1a?w=200&h=200&fit=crop'
    },
    equipmentPhotos: {
      'Bowl': 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=200&h=200&fit=crop',
      'Fork': 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=200&h=200&fit=crop',
      'Small Pan': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop',
      'Spatula': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop',
      'Plate': 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=200&h=200&fit=crop'
    }
  },
  'basic-toast': {
    recipeId: 'basic-toast',
    mainPhoto: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop',
    stepPhotos: {
      1: 'https://images.unsplash.com/photo-1595853035070-59a39fe84de4?w=600&h=400&fit=crop', // bread slices
      2: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&h=400&fit=crop', // toaster
      3: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&h=400&fit=crop', // toasting
      4: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop', // hot toast
      5: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop', // spreading butter
      6: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop' // buttered toast
    },
    ingredientPhotos: {
      'Bread': 'https://images.unsplash.com/photo-1595853035070-59a39fe84de4?w=200&h=200&fit=crop',
      'Butter': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=200&h=200&fit=crop'
    },
    equipmentPhotos: {
      'Toaster': 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=200&h=200&fit=crop',
      'Butter Knife': 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=200&h=200&fit=crop',
      'Plate': 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=200&h=200&fit=crop'
    }
  },
  'basic-tea': {
    recipeId: 'basic-tea',
    mainPhoto: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&h=600&fit=crop',
    stepPhotos: {
      1: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&h=400&fit=crop', // kettle with water
      2: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&h=400&fit=crop', // boiling kettle
      3: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&h=400&fit=crop', // tea bag in mug
      4: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&h=400&fit=crop', // pouring hot water
      5: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&h=400&fit=crop', // steeping tea
      6: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&h=400&fit=crop' // finished tea
    },
    ingredientPhotos: {
      'Water': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200&h=200&fit=crop',
      'Tea Bag': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200&h=200&fit=crop',
      'Milk': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop',
      'Sugar': 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=200&h=200&fit=crop'
    },
    equipmentPhotos: {
      'Kettle': 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=200&h=200&fit=crop',
      'Mug': 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=200&h=200&fit=crop',
      'Spoon': 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=200&h=200&fit=crop'
    }
  },
  'basic-coffee': {
    recipeId: 'basic-coffee',
    mainPhoto: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop',
    stepPhotos: {
      1: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&h=400&fit=crop', // kettle
      2: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&h=400&fit=crop', // boiling water
      3: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&fit=crop', // instant coffee in mug
      4: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&fit=crop', // pouring water
      5: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&fit=crop', // stirring coffee
      6: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&fit=crop' // finished coffee
    },
    ingredientPhotos: {
      'Water': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200&h=200&fit=crop',
      'Instant Coffee': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=200&h=200&fit=crop',
      'Milk': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop',
      'Sugar': 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=200&h=200&fit=crop'
    },
    equipmentPhotos: {
      'Kettle': 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=200&h=200&fit=crop',
      'Mug': 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=200&h=200&fit=crop',
      'Spoon': 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=200&h=200&fit=crop'
    }
  },
  'basic-grilled-cheese': {
    recipeId: 'basic-grilled-cheese',
    mainPhoto: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=800&h=600&fit=crop',
    stepPhotos: {
      1: 'https://images.unsplash.com/photo-1595853035070-59a39fe84de4?w=600&h=400&fit=crop', // bread slices
      2: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=600&h=400&fit=crop', // butter on bread
      3: 'https://images.unsplash.com/photo-1452251889946-8ff5ea7f27f8?w=600&h=400&fit=crop', // cheese on bread
      4: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop', // pan heating
      5: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=600&h=400&fit=crop', // cooking sandwich
      6: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=600&h=400&fit=crop' // grilled cheese done
    },
    ingredientPhotos: {
      'Bread': 'https://images.unsplash.com/photo-1595853035070-59a39fe84de4?w=200&h=200&fit=crop',
      'Cheese Slices': 'https://images.unsplash.com/photo-1452251889946-8ff5ea7f27f8?w=200&h=200&fit=crop',
      'Butter': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=200&h=200&fit=crop'
    },
    equipmentPhotos: {
      'Frying Pan': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop',
      'Spatula': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop',
      'Plate': 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=200&h=200&fit=crop'
    }
  }
};

/**
 * Get photo for a specific basic recipe
 */
export function getBasicRecipePhoto(recipeId: string): RecipePhoto | null {
  return basicRecipePhotos[recipeId] || null;
}

/**
 * Get step photo for a basic recipe
 */
export function getBasicRecipeStepPhoto(recipeId: string, stepNumber: number): string | null {
  const recipePhoto = basicRecipePhotos[recipeId];
  return recipePhoto?.stepPhotos[stepNumber] || null;
}

/**
 * Get ingredient photo for a basic recipe
 */
export function getBasicRecipeIngredientPhoto(recipeId: string, ingredientName: string): string | null {
  const recipePhoto = basicRecipePhotos[recipeId];
  return recipePhoto?.ingredientPhotos[ingredientName] || null;
}

/**
 * Get equipment photo for a basic recipe
 */
export function getBasicRecipeEquipmentPhoto(recipeId: string, equipmentName: string): string | null {
  const recipePhoto = basicRecipePhotos[recipeId];
  return recipePhoto?.equipmentPhotos[equipmentName] || null;
}
