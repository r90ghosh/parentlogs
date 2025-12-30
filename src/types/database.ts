export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Will be filled after schema creation
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
