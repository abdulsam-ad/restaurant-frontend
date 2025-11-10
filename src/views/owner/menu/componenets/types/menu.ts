export interface MenuForm {
  name: string;
  description: string;
  restaurant: number | null;
}

export interface ItemForm {
  name: string;
  restaurant: number | null;
  description: string;
  price: number | null;
  category: string | number | null;
  file: File | null;
  preview?: string | null;
}

export interface IngredientForm {
  name: string;
  description: string;
  quantity: number | null;
  file: File | null;
  preview?: string | null;
}

export interface LocalItem {
  name: string;
  description: string;
  price: number | null;
  category: string | number | null;
  file: File | null;
  preview: string | null;
  ingredients: LocalIngredient[];
  _localId: number;
}

export interface LocalIngredient {
  name: string;
  quantity: number | null;
  description: string;
  file: File | null;
  preview: string | null;
  _localId: number;
}

export interface Category {
  id: number;
  name: string;
  // Add other category properties as needed
}

export interface MenuResponse {
  id: number;
  name: string;
  description: string;
  restaurant: number;
  // Add other menu properties as needed
}