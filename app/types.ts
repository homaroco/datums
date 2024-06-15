export interface TagProps {
  color: string,
  name?: string,
  value?: string,
  unit?: string,
}

export interface DatumProps {
  id: string,
  createdAt: number,
  tags: Tag[],
}