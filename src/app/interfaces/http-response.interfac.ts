export interface HttpResMsg<T> {
  success: boolean,
  message: string,
  data: T,
  total_count?: 0,
  status: number,
  error?: string
}