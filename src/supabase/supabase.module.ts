import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { SupabaseController } from './supabase.contoller';

@Module({
  providers: [SupabaseService],
  controllers: [SupabaseController],
})
export class SupabaseModule {}
