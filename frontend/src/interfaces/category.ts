export interface ICategory {
  id: string;
  name: string;
  slug: string;
  parent_id?: number;
  is_active: boolean;
}

export interface IFormData {
  id: number | string;
  name: string;
  slug: string;
  parent_id?: number;
}
