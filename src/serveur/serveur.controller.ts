import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { ServeurService } from './serveur.service';
import { AuthGuard } from 'src/auth.guard';

@Controller('serveur')
export class ServeurController {
  constructor(private readonly serveurService: ServeurService) { }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Request() requete) {
    console.log(requete.user.sub);

    return this.serveurService.findAllPublic();
  }

  @Get('/possede')
  @UseGuards(AuthGuard)
  findAllServerOfUser(@Request() requete) {
    return this.serveurService.findAllServerOfUser(requete.user.sub);
  }

  @Post()
  async create(@Body() createServeurDto: any) {
    return this.serveurService.create(createServeurDto);
  }
  @Post(':id/salon')
  @UseGuards(AuthGuard)
  async addSalon(
    @Param('id') id: string,
    @Body() body: { name: string }
  ) {
    return this.serveurService.addSalon(id, body.name);
  }

  @Post('/:serverId/salon/:salonId/message')
  async addMessage(
    @Param('serverId') serverId: string,
    @Param('salonId') salonId: number,
    @Body() createMessageDto: { content: string; userId: string },
  ) {
    return this.serveurService.addMessage(serverId, salonId, createMessageDto.content, createMessageDto.userId);
  }

  @Post('/:serverId/blacklist')
  @UseGuards(AuthGuard)
  addToBlacklist(@Param('serverId') serverId: string, @Body() body: any) {
    return this.serveurService.addToBlacklist(serverId, body.userId);
  }
}


