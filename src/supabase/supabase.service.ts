import { Inject, Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { Database } from 'src/types/supabase';

@Injectable({ scope: Scope.REQUEST })
export class SupabaseService {
  private clientInstance: SupabaseClient<Database>;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly configService: ConfigService,
  ) {}

  async getClient() {
    if (this.clientInstance) {
      return this.clientInstance;
    }

    this.clientInstance = createClient<Database>(
      this.configService.get('SUPABASE_API_URL'),
      this.configService.get('SUPABASE_ANON_KEY'),
      {
        auth: {
          persistSession: false,
        },
      },
    );
    return this.clientInstance;
  }
}
