import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Controller('api')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get()
  async getHello() {
    console.log('hi');
    const supabase = await this.supabaseService.getClient();
    const { data } = await supabase.from('url_infos').select('*');

    console.log(data);
    return data;
  }
}
