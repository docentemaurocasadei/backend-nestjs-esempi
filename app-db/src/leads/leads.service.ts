import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { DbService } from 'src/db/db.service';

@Injectable()
export class LeadsService {
  private leads = [];
  private dbService: DbService;

  constructor(dbService: DbService) {
    this.dbService = dbService;
  }
  create(createLeadDto: CreateLeadDto) {
    return this.dbService.execute(
      'INSERT INTO leads (name, surname, gender) VALUES (?, ?, ?)',
      [createLeadDto.name, createLeadDto.surname, createLeadDto.gender]
    );
  }

  findAll() {
    return this.dbService.query('SELECT * FROM leads');
  }

  findOne(id: number) {
    return this.dbService.query('SELECT * FROM leads WHERE id = ?', [id]);
  }

  async update(id: number, dto: UpdateLeadDto) {
    const fields: string[] = [];
    const values: any[] = [];
    for (const key in dto) {
      if (dto[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(dto[key]);
      }
    }
    if (fields.length === 0) {
      throw new BadRequestException('No fields to update');
    }
    values.push(id);
    const sql = `UPDATE leads SET ${fields.join(', ')} WHERE id = ?`;
    const res = await this.dbService.execute(sql, values);
    return await this.findOne(id);
  }

  remove(id: number) {
    return this.dbService.execute('DELETE FROM leads WHERE id = ?', [id]);
  }
}
