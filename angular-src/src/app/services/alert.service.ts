import { Injectable } from '@angular/core';
import {MessageService} from 'primeng/components/common/messageservice';
import {Message} from 'primeng/components/common/message';

@Injectable()
export class AlertService {
  constructor(private messageService: MessageService) { }

  showSuccessGrowlMessage(message: string, summary: string) {
    const growlMsg: Message = {
      severity: 'success',
      summary: summary,
      detail: message
    };
    this.messageService.add(growlMsg);
  }
}
