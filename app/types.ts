export interface TagProps {
  color: string
  name?: string
  value?: string
  unit?: string
}

export interface TagRow {
  datumUuid: string
  color: string
  name: string
  value: string | null
  unit: string | null
}

export interface ITag {
  color: string
  name: string
  value?: string
  unit?: string
}

export interface DatumProps {
  uuid: string
  createdAt: number
  tags: TagProps[]
}

export interface StagedTag {
  id: string
  color: string
  name: string
  value: string | undefined
  focused: 'name' | 'value' | boolean
  width: number
}
